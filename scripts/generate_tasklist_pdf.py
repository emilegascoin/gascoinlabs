"""Generate the personal website task list PDF for Emile."""
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, ListFlowable, ListItem,
    HRFlowable, KeepTogether
)

CREAM = HexColor("#faf6ee")
INK = HexColor("#1a1a1a")
MUTED = HexColor("#6b6b6b")
ACCENT = HexColor("#1f3a5f")

OUTPUT = "/Users/emile/Desktop/Personal Projects/Personal Website/Emile - Personal Website Task List.pdf"

styles = getSampleStyleSheet()

title_style = ParagraphStyle(
    "Title", parent=styles["Title"],
    fontName="Times-Italic", fontSize=28, leading=32,
    textColor=INK, spaceAfter=4, alignment=TA_LEFT,
)
subtitle_style = ParagraphStyle(
    "Subtitle", parent=styles["Normal"],
    fontName="Helvetica", fontSize=10, leading=14,
    textColor=MUTED, spaceAfter=18, alignment=TA_LEFT,
)
section_style = ParagraphStyle(
    "Section", parent=styles["Heading2"],
    fontName="Times-Bold", fontSize=16, leading=20,
    textColor=INK, spaceBefore=18, spaceAfter=8,
)
label_style = ParagraphStyle(
    "Label", parent=styles["Normal"],
    fontName="Helvetica-Bold", fontSize=8.5, leading=11,
    textColor=ACCENT, spaceAfter=4,
)
body_style = ParagraphStyle(
    "Body", parent=styles["Normal"],
    fontName="Helvetica", fontSize=10.5, leading=15,
    textColor=INK, spaceAfter=6,
)
item_style = ParagraphStyle(
    "Item", parent=body_style, leftIndent=0, spaceAfter=4,
)
note_style = ParagraphStyle(
    "Note", parent=body_style,
    fontSize=9.5, textColor=MUTED, fontName="Helvetica-Oblique",
)


def task(num, title, detail=None):
    text = f'<font color="#1f3a5f"><b>☐ {num}.</b></font> <b>{title}</b>'
    if detail:
        text += f'<br/><font color="#6b6b6b">{detail}</font>'
    return Paragraph(text, item_style)


def section(label, heading):
    return [
        Paragraph(label.upper(), label_style),
        Paragraph(heading, section_style),
    ]


def divider():
    return HRFlowable(width="100%", thickness=0.5, color=MUTED,
                       spaceBefore=14, spaceAfter=14)


def build():
    doc = SimpleDocTemplate(
        OUTPUT, pagesize=A4,
        leftMargin=2.2*cm, rightMargin=2.2*cm,
        topMargin=2.2*cm, bottomMargin=2.2*cm,
        title="Personal Website — Task List",
        author="Emile Gascoin",
    )

    story = []

    story.append(Paragraph("Personal Website", title_style))
    story.append(Paragraph(
        "Your task list — the human-only bits. Claude Code handles all the actual coding.<br/>"
        "Domain: gascoinlabs.com &nbsp;·&nbsp; 2026-04-27",
        subtitle_style,
    ))
    story.append(divider())

    # Accounts
    story += section("Step 1", "Accounts to create (free unless noted)")
    story.append(task(1, "Google AI Studio",
        "Sign in with Google, generate a Gemini API key. Default provider, free tier."))
    story.append(task(2, "Vercel",
        "Sign up with GitHub, no card needed for hobby tier."))
    story.append(task(3, "Cloudflare",
        "Sign up, create a Turnstile site for gascoinlabs.com, get site key + secret."))
    story.append(task(4, "Upstash",
        "Sign up, create a Redis database in Sydney/Singapore region, grab REST URL + token."))
    story.append(task(5, "GitHub", "Already done."))
    story.append(task(6, "Anthropic Console (optional)",
        "Only if you want to switch from Gemini to Claude later. Skip for now."))

    story.append(divider())

    # Domain
    story += section("Step 2", "Domain")
    story.append(task(7, "Point gascoinlabs.com DNS at Vercel",
        "Vercel gives you the DNS records to paste into your registrar after the project deploys. We'll do this together once the site is live on a Vercel preview URL."))

    story.append(divider())

    # Content
    story += section("Step 3", "Content you'll write")
    story.append(task(8, "Hero copy",
        "One-line positioning, the 'what I do' line."))
    story.append(task(9, "About paragraph",
        "Who you are, how you work, what you're looking for."))
    story.append(task(10, "AI workflow section copy",
        "Your story, the 5x productivity claim framed your way."))
    story.append(task(11, "Widget greeting + 3 suggestion chips",
        "The personal voice on the chat bubble."))
    story.append(task(12, "Reference quote final wording",
        "Confirm what to pull from Monaghan's letter."))
    story.append(task(13, "Contact section",
        "Confirm what's listed (email, phone, GitHub, location)."))

    story.append(divider())

    # Assets
    story += section("Step 4", "Assets to dig up")
    story.append(task(14, "Initial-design screenshot of elecdes",
        "The version before your boss had you rework it."))
    story.append(task(15, "elecdes before/after screenshots",
        "Old elecdes.com hero vs. your beta.elecdes.com hero. (I can grab these from the live URLs if you'd rather skip.)"))
    story.append(task(16, "Profile photo",
        "Same one from the CV is fine, or a new headshot if you've got one."))
    story.append(task(17, "Whisper transcription tool material",
        "Any screenshots, sample SRT output, or a written description for the case study."))

    story.append(divider())

    # Decisions
    story += section("Step 5", "Decisions to give Claude before build")
    story.append(task(18, "Daily spend cap final number",
        "$1? $0.50? Something else? With Gemini Flash on free tier you're unlikely to hit it either way."))
    story.append(task(19, "Accent colour",
        "Happy for me to pick a warm rust/terracotta to match the editorial cream palette, or you have something specific in mind?"))
    story.append(task(20, "Approve git init",
        "Say the word and I'll initialise the repo, commit the spec, and start the implementation plan."))

    story.append(Spacer(1, 18))
    story.append(divider())
    story.append(Paragraph(
        "When you've worked through this list (or the parts you want to do first), come back and tell me which items are sorted. We don't need everything done before starting — accounts and decisions first, content and assets can come during the build.",
        note_style,
    ))

    doc.build(story)
    print(f"Wrote {OUTPUT}")


if __name__ == "__main__":
    build()
