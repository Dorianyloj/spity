import { randomUUID } from 'node:crypto'
import mysql from 'mysql2/promise'

// Deliberately server-only. No password reset, account creation or public bootstrap endpoint.
// Supply the existing account email on stdin, never a password or command-line credential.
async function main() {
  let input = ''
  for await (const chunk of process.stdin) {
    input += chunk.toString('utf8')
    if (Buffer.byteLength(input) > 512) throw new Error('Entrée trop longue.')
  }
  const email = input.trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) throw new Error('Adresse e-mail invalide.')
  if (!process.env.DATABASE_URL) throw new Error('Configuration base de données absente.')
  const connection = await mysql.createConnection(process.env.DATABASE_URL)
  try {
    await connection.beginTransaction()
    const [rows] = await connection.execute('SELECT id, is_admin, is_suspended FROM users WHERE email = ? FOR UPDATE', [email])
    const account = rows[0]
    if (!account) throw new Error('Compte inexistant : inscription préalable requise.')
    if (account.is_suspended) throw new Error('Compte suspendu : intervention manuelle requise.')
    if (account.is_admin) {
      await connection.rollback()
      process.stdout.write('Compte déjà administrateur. Aucun changement.\n')
      return
    }
    await connection.execute('UPDATE users SET is_admin = true, session_version = session_version + 1 WHERE id = ?', [account.id])
    await connection.execute('INSERT INTO admin_audit_logs (id, actor_id, action, target_id, reason) VALUES (?, NULL, ?, ?, ?)', [randomUUID(), 'admin_granted', account.id, 'Activation administrateur par une opération serveur autorisée.'])
    await connection.commit()
    process.stdout.write('Accès administrateur activé. Mot de passe conservé. Reconnexion nécessaire.\n')
  } catch (error) {
    await connection.rollback()
    // Do not expose driver diagnostics: they can contain credentials or personal data.
    if (error?.code) throw new Error('Opération base de données impossible ; aucun changement validé.')
    throw error
  } finally { await connection.end() }
}

main().catch((error) => {
  process.stderr.write(`${error?.code ? 'Connexion à la base impossible.' : error.message}\n`)
  process.exitCode = 1
})
