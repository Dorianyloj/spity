from __future__ import annotations

import re
from pathlib import Path
from xml.sax.saxutils import escape

from reportlab import __file__ as reportlab_file
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    Image,
    KeepTogether,
    ListFlowable,
    ListItem,
    PageBreak,
    PageTemplate,
    Paragraph,
    Preformatted,
    Spacer,
    Table,
    TableStyle,
)
from reportlab.platypus.tableofcontents import TableOfContents


ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "docs" / "rncp" / "bloc-04" / "DOSSIER_BLOC_04.md"
OUTPUT = ROOT / "output" / "pdf" / "dossier-bloc-04-spity.pdf"
LOGO = ROOT / "spity" / "public" / "images" / "brand" / "logo-spity-transparent.png"

SPITY_DARK = colors.HexColor("#173236")
SPITY_GREEN = colors.HexColor("#8bb957")
SPITY_LIGHT = colors.HexColor("#eff6ef")
SPITY_MUTED = colors.HexColor("#55645b")
SPITY_BORDER = colors.HexColor("#ccd9c7")


def register_fonts() -> None:
    fonts = Path(reportlab_file).resolve().parent / "fonts"
    pdfmetrics.registerFont(TTFont("Vera", fonts / "Vera.ttf"))
    pdfmetrics.registerFont(TTFont("Vera-Bold", fonts / "VeraBd.ttf"))
    pdfmetrics.registerFont(TTFont("Vera-Italic", fonts / "VeraIt.ttf"))
    pdfmetrics.registerFont(TTFont("Vera-BoldItalic", fonts / "VeraBI.ttf"))
    pdfmetrics.registerFontFamily(
        "Vera",
        normal="Vera",
        bold="Vera-Bold",
        italic="Vera-Italic",
        boldItalic="Vera-BoldItalic",
    )


register_fonts()


def inline_markup(value: str) -> str:
    placeholders: list[str] = []

    def preserve_code(match: re.Match[str]) -> str:
        placeholders.append(f'<font name="Courier">{escape(match.group(1))}</font>')
        return f"@@CODE{len(placeholders) - 1}@@"

    value = re.sub(r"`([^`]+)`", preserve_code, value)
    value = escape(value)
    value = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", value)
    value = re.sub(r"\[(.+?)\]\((.+?)\)", r'<link href="\2" color="#376b31">\1</link>', value)

    for index, replacement in enumerate(placeholders):
        value = value.replace(f"@@CODE{index}@@", replacement)

    return value


styles = getSampleStyleSheet()
body = ParagraphStyle(
    "Body",
    parent=styles["BodyText"],
    fontName="Vera",
    fontSize=9.2,
    leading=13.2,
    textColor=SPITY_DARK,
    spaceAfter=3 * mm,
    alignment=TA_LEFT,
)
small = ParagraphStyle(
    "Small",
    parent=body,
    fontSize=7.4,
    leading=9.5,
    spaceAfter=0,
)
h1 = ParagraphStyle(
    "H1",
    parent=body,
    fontName="Vera-Bold",
    fontSize=23,
    leading=28,
    textColor=SPITY_DARK,
    spaceAfter=6 * mm,
)
h2 = ParagraphStyle(
    "H2",
    parent=body,
    fontName="Vera-Bold",
    fontSize=16,
    leading=20,
    textColor=SPITY_DARK,
    spaceBefore=2 * mm,
    spaceAfter=5 * mm,
    keepWithNext=True,
)
h3 = ParagraphStyle(
    "H3",
    parent=body,
    fontName="Vera-Bold",
    fontSize=11.5,
    leading=15,
    textColor=colors.HexColor("#376b31"),
    spaceBefore=3 * mm,
    spaceAfter=2 * mm,
    keepWithNext=True,
)
quote = ParagraphStyle(
    "Quote",
    parent=body,
    fontName="Vera-Italic",
    leftIndent=7 * mm,
    borderColor=SPITY_GREEN,
    borderWidth=0,
    borderPadding=4 * mm,
    backColor=SPITY_LIGHT,
)
code = ParagraphStyle(
    "Code",
    parent=body,
    fontName="Courier",
    fontSize=7.2,
    leading=9.2,
    leftIndent=3 * mm,
    rightIndent=3 * mm,
    borderPadding=3 * mm,
    backColor=colors.HexColor("#f3f5f2"),
    textColor=colors.HexColor("#243b3d"),
)
cover_title = ParagraphStyle(
    "CoverTitle",
    parent=h1,
    fontSize=28,
    leading=34,
    alignment=TA_CENTER,
    spaceAfter=8 * mm,
)
cover_subtitle = ParagraphStyle(
    "CoverSubtitle",
    parent=body,
    fontSize=12,
    leading=17,
    alignment=TA_CENTER,
    textColor=SPITY_MUTED,
)


class Bloc4Document(BaseDocTemplate):
    def __init__(self, filename: str):
        super().__init__(
            filename,
            pagesize=A4,
            leftMargin=18 * mm,
            rightMargin=18 * mm,
            topMargin=20 * mm,
            bottomMargin=18 * mm,
            title="Bloc 4 - Maintenir Spity en condition opérationnelle",
            author="Dorian Joly",
            subject="Dossier RNCP Bloc 4 - Expert en développement logiciel",
        )
        frame = Frame(
            self.leftMargin,
            self.bottomMargin,
            self.width,
            self.height,
            id="content",
        )
        self.addPageTemplates([PageTemplate(id="main", frames=[frame], onPage=self.draw_page)])
        self.heading_counter = 0

    def beforeDocument(self) -> None:
        self.heading_counter = 0
        super().beforeDocument()

    def draw_page(self, canvas, doc) -> None:
        canvas.saveState()
        width, height = A4

        if doc.page == 1:
            canvas.setFillColor(SPITY_GREEN)
            canvas.rect(0, height - 9 * mm, width, 9 * mm, stroke=0, fill=1)
            canvas.setFillColor(SPITY_DARK)
            canvas.rect(0, 0, width, 8 * mm, stroke=0, fill=1)
        else:
            canvas.setStrokeColor(SPITY_BORDER)
            canvas.line(18 * mm, height - 13 * mm, width - 18 * mm, height - 13 * mm)
            canvas.setFont("Vera-Bold", 7.5)
            canvas.setFillColor(SPITY_DARK)
            canvas.drawString(18 * mm, height - 10 * mm, "SPITY - DOSSIER BLOC 4")
            canvas.setFont("Vera", 7.5)
            canvas.setFillColor(SPITY_MUTED)
            canvas.drawRightString(width - 18 * mm, 9 * mm, f"Page {doc.page}")
            canvas.drawString(18 * mm, 9 * mm, "Expert en développement logiciel - 13 août 2026")

        canvas.restoreState()

    def afterFlowable(self, flowable) -> None:
        if isinstance(flowable, Paragraph) and flowable.style.name in {"H2", "H3"}:
            level = 0 if flowable.style.name == "H2" else 1
            text = flowable.getPlainText()
            key = f"heading-{self.heading_counter}"
            self.heading_counter += 1
            self.canv.bookmarkPage(key)
            self.canv.addOutlineEntry(text, key, level=level, closed=False)
            self.notify("TOCEntry", (level, text, self.page, key))


def make_table(rows: list[list[str]], available_width: float) -> Table:
    column_count = max(len(row) for row in rows)
    normalized = [row + [""] * (column_count - len(row)) for row in rows]
    lengths = []

    for index in range(column_count):
        longest = max(len(re.sub(r"[*`]", "", row[index])) for row in normalized)
        lengths.append(min(max(longest, 8), 38))

    total = sum(lengths)
    widths = [available_width * length / total for length in lengths]
    data = [[Paragraph(inline_markup(cell), small) for cell in row] for row in normalized]
    table = Table(data, colWidths=widths, repeatRows=1, hAlign="LEFT")
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), SPITY_DARK),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Vera-Bold"),
        ("BACKGROUND", (0, 1), (-1, -1), colors.white),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, SPITY_LIGHT]),
        ("GRID", (0, 0), (-1, -1), 0.35, SPITY_BORDER),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 4),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    return table


def parse_markdown(content: str, available_width: float) -> list:
    lines = content.splitlines()
    story = []
    paragraph_lines: list[str] = []
    list_items: list[str] = []
    table_lines: list[str] = []
    code_lines: list[str] = []
    in_code = False
    seen_section = False

    def flush_paragraph() -> None:
        if paragraph_lines:
            text = " ".join(line.strip() for line in paragraph_lines)
            story.append(Paragraph(inline_markup(text), body))
            paragraph_lines.clear()

    def flush_list() -> None:
        if list_items:
            items = [ListItem(Paragraph(inline_markup(item), body), leftIndent=4 * mm) for item in list_items]
            story.append(ListFlowable(items, bulletType="bullet", start="bulletchar", leftIndent=7 * mm, bulletFontName="Vera"))
            story.append(Spacer(1, 2 * mm))
            list_items.clear()

    def flush_table() -> None:
        if not table_lines:
            return
        parsed = []
        for line in table_lines:
            cells = [cell.strip() for cell in line.strip().strip("|").split("|")]
            if all(re.fullmatch(r":?-{3,}:?", cell) for cell in cells):
                continue
            parsed.append(cells)
        if parsed:
            story.append(make_table(parsed, available_width))
            story.append(Spacer(1, 4 * mm))
        table_lines.clear()

    for line in lines:
        if line.startswith("```"):
            flush_paragraph()
            flush_list()
            flush_table()
            if in_code:
                story.append(Preformatted("\n".join(code_lines), code))
                story.append(Spacer(1, 3 * mm))
                code_lines.clear()
                in_code = False
            else:
                in_code = True
            continue

        if in_code:
            code_lines.append(line)
            continue

        if line.startswith("|") and line.rstrip().endswith("|"):
            flush_paragraph()
            flush_list()
            table_lines.append(line)
            continue
        flush_table()

        if not line.strip():
            flush_paragraph()
            flush_list()
            continue

        if line.startswith("# "):
            continue

        if line.startswith("## "):
            flush_paragraph()
            flush_list()
            if seen_section:
                story.append(PageBreak())
            seen_section = True
            story.append(Paragraph(inline_markup(line[3:].strip()), h2))
            continue

        if line.startswith("### "):
            flush_paragraph()
            flush_list()
            story.append(Paragraph(inline_markup(line[4:].strip()), h3))
            continue

        if line.startswith("- "):
            flush_paragraph()
            list_items.append(line[2:].strip())
            continue

        if re.match(r"^\d+\. ", line):
            flush_paragraph()
            list_items.append(re.sub(r"^\d+\. ", "", line).strip())
            continue

        if line.startswith("> "):
            flush_paragraph()
            flush_list()
            story.append(Paragraph(inline_markup(line[2:].strip()), quote))
            continue

        paragraph_lines.append(line.rstrip())

    flush_paragraph()
    flush_list()
    flush_table()
    return story


def build_story(document: Bloc4Document) -> list:
    markdown = SOURCE.read_text(encoding="utf-8")
    story = [Spacer(1, 22 * mm)]

    if LOGO.exists():
        logo = Image(str(LOGO), width=34 * mm, height=34 * mm)
        logo.hAlign = "CENTER"
        story.extend([logo, Spacer(1, 12 * mm)])

    story.extend([
        Paragraph("Bloc 4", cover_title),
        Paragraph("Maintenir l'application logicielle<br/>en condition opérationnelle", cover_title),
        Spacer(1, 4 * mm),
        Paragraph("Dossier écrit - Projet Spity", cover_subtitle),
        Spacer(1, 15 * mm),
    ])

    summary = Table([
        [Paragraph("Certification", small), Paragraph("Expert en développement logiciel", small)],
        [Paragraph("Candidat", small), Paragraph("Dorian Joly", small)],
        [Paragraph("Référentiel", small), Paragraph("Ynov 2024 - C4.1.1 à C4.3.3", small)],
        [Paragraph("Version", small), Paragraph("1.0 - 13 août 2026", small)],
        [Paragraph("État", small), Paragraph("7 compétences documentées et vérifiables", small)],
    ], colWidths=[42 * mm, 90 * mm], hAlign="CENTER")
    summary.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, -1), SPITY_DARK),
        ("TEXTCOLOR", (0, 0), (0, -1), colors.white),
        ("FONTNAME", (0, 0), (0, -1), "Vera-Bold"),
        ("BACKGROUND", (1, 0), (1, -1), SPITY_LIGHT),
        ("GRID", (0, 0), (-1, -1), 0.5, SPITY_BORDER),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ]))
    story.extend([
        summary,
        Spacer(1, 18 * mm),
        Paragraph("Mise en situation réelle et fictive déclarée - preuves anonymisées et reproductibles", cover_subtitle),
        PageBreak(),
        Paragraph("Sommaire", h2),
    ])

    toc = TableOfContents()
    toc.levelStyles = [
        ParagraphStyle("TOC1", fontName="Vera-Bold", fontSize=10, leading=15, textColor=SPITY_DARK, leftIndent=0, firstLineIndent=0, spaceBefore=2),
        ParagraphStyle("TOC2", fontName="Vera", fontSize=8.5, leading=12, textColor=SPITY_MUTED, leftIndent=8 * mm, firstLineIndent=0),
    ]
    story.extend([toc, PageBreak()])
    story.extend(parse_markdown(markdown, document.width))
    return story


def main() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    document = Bloc4Document(str(OUTPUT))
    document.multiBuild(build_story(document))
    print(f"PDF Bloc 4 généré : {OUTPUT}")


if __name__ == "__main__":
    main()
