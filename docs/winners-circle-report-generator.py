import os
import matplotlib.pyplot as plt
import numpy as np
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle, PageBreak, ListFlowable, ListItem
from reportlab.pdfgen import canvas
from reportlab.graphics.shapes import Drawing
from reportlab.graphics.charts.piecharts import Pie
from reportlab.graphics.charts.barcharts import VerticalBarChart
from reportlab.graphics.charts.linecharts import HorizontalLineChart
from reportlab.graphics.widgets.markers import makeMarker
from reportlab.graphics.charts.legends import Legend
import matplotlib
import argparse
matplotlib.use('Agg')  # Use non-interactive backend

# Define colors to match Winners Circle site style
PRIMARY_COLOR = colors.HexColor('#0284c7')  # primary-600
DARK_BROWN = colors.HexColor('#5A3E00')
BACKGROUND_COLOR = colors.HexColor('#D8D1AE')
SECONDARY_COLOR = colors.HexColor('#0ea5e9')  # primary-500
ACCENT_COLOR = colors.HexColor('#7dd3fc')  # primary-300
LIGHT_COLOR = colors.HexColor('#f0f9ff')  # primary-50

# Set up the document
def create_winners_circle_report(output_filename='Winners_Circle_Analysis.pdf'):
    doc = SimpleDocTemplate(
        output_filename,
        pagesize=letter,
        rightMargin=0.75*inch,
        leftMargin=0.75*inch,
        topMargin=0.75*inch,
        bottomMargin=0.75*inch
    )
    
    # Container for the 'Flowable' objects
    elements = []
    
    # Define styles
    styles = getSampleStyleSheet()
    
    # Modify existing styles
    styles['Title'].fontName = 'Helvetica-Bold'
    styles['Title'].fontSize = 24
    styles['Title'].textColor = DARK_BROWN
    styles['Title'].spaceAfter = 24
    styles['Title'].alignment = TA_CENTER
    
    # Customize Subtitle style
    styles.add(ParagraphStyle(
        name='WC_Subtitle',
        parent=styles['Heading2'],
        fontName='Helvetica',
        fontSize=18,
        textColor=PRIMARY_COLOR,
        spaceAfter=12,
        alignment=TA_CENTER
    ))
    
    # Modify Heading2 style
    styles['Heading2'].fontName = 'Helvetica-Bold'
    styles['Heading2'].fontSize = 16
    styles['Heading2'].textColor = DARK_BROWN
    styles['Heading2'].spaceBefore = 12
    styles['Heading2'].spaceAfter = 8
    
    # Modify Heading3 style
    styles['Heading3'].fontName = 'Helvetica-Bold'
    styles['Heading3'].fontSize = 14
    styles['Heading3'].textColor = PRIMARY_COLOR
    styles['Heading3'].spaceBefore = 10
    styles['Heading3'].spaceAfter = 6
    
    # Modify Normal style
    styles['Normal'].fontName = 'Helvetica'
    styles['Normal'].fontSize = 11
    styles['Normal'].textColor = colors.black
    styles['Normal'].alignment = TA_JUSTIFY
    styles['Normal'].spaceBefore = 6
    styles['Normal'].spaceAfter = 6
    
    # Add Emphasis style
    styles.add(ParagraphStyle(
        name='Emphasis',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        textColor=DARK_BROWN
    ))
    
    # Add Quote style
    styles.add(ParagraphStyle(
        name='Quote',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=12,
        textColor=PRIMARY_COLOR,
        leftIndent=20,
        rightIndent=20,
        spaceBefore=12,
        spaceAfter=12
    ))
    
    # Add Caption style
    styles.add(ParagraphStyle(
        name='Caption',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=10,
        textColor=colors.darkgray,
        alignment=TA_CENTER,
        spaceBefore=4,
        spaceAfter=16
    ))
    
    # Title Page
    elements.append(Paragraph("Winners Circle Club", styles['Title']))
    elements.append(Paragraph("Comprehensive Analysis Report", styles['WC_Subtitle']))
    elements.append(Spacer(1, 2*inch))
    
    # Create a placeholder for the winery logo image
    # Uncomment and modify path if you have a logo
    # logo = Image("path_to_logo.png", width=3*inch, height=1.5*inch)
    # elements.append(logo)
    
    elements.append(Spacer(1, 2*inch))
    elements.append(Paragraph("Prepared for Milea Estate Vineyard", styles['Normal']))
    elements.append(Paragraph(f"April 2025", styles['Normal']))
    
    elements.append(PageBreak())
    
    # Executive Summary
    elements.append(Paragraph("Executive Summary", styles['Heading2']))
    elements.append(Paragraph(
        """The Winner's Circle Club represents Milea Estate Vineyard's strategic move to establish an ultra-premium 
        membership tier designed to transform the traditional wine club experience into a comprehensive lifestyle 
        proposition. Based on our detailed analysis, this premium credit-based membership program presents a compelling 
        opportunity for sustainable revenue growth, enhanced customer loyalty, and strengthened brand positioning.""", 
        styles['Normal']
    ))
    
    elements.append(Paragraph(
        """Our financial projections indicate that the Winner's Circle Club will contribute significantly to Milea's 
        growth, with revenue increasing from $159,360 in Year 1 to $699,986 by Year 4. This represents a compelling 
        return on investment with a payback period of approximately 28 months on the initial capital investment.""", 
        styles['Normal']
    ))
    
    elements.append(Paragraph(
        """Key highlights of the Winner's Circle Club include:""", 
        styles['Normal']
    ))
    
    # Key highlights bullet points
    highlights = ListFlowable(
        [
            ListItem(Paragraph("A flexible credit-based model with quarterly fees of $500 ($2,000 annually)", styles['Normal'])),
            ListItem(Paragraph("Projected growth from 64 members in Year 1 to 281 members by Year 4", styles['Normal'])),
            ListItem(Paragraph("Enhanced member lifetime value of $8,000 compared to $1,920 for traditional club members", styles['Normal'])),
            ListItem(Paragraph("Comprehensive redemption options spanning wine purchases, accommodations, and culinary experiences", styles['Normal'])),
            ListItem(Paragraph("Exclusive access to premium facilities and personalized services", styles['Normal'])),
        ],
        bulletType='bullet',
        leftIndent=20
    )
    elements.append(highlights)
    
    elements.append(Spacer(1, 0.2*inch))
    elements.append(Paragraph(
        """This report provides a detailed analysis of the Winner's Circle concept, membership projections, revenue 
        forecasts, implementation strategy, and supporting financial assumptions.""", 
        styles['Normal']
    ))
    
    elements.append(PageBreak())
    
    # Table of Contents
    elements.append(Paragraph("Table of Contents", styles['Heading2']))
    elements.append(Spacer(1, 0.2*inch))
    
    toc_data = [
        ["1. Club Concept and Structure", "4"],
        ["2. Membership Growth Projections", "7"],
        ["3. Revenue Analysis", "10"],
        ["4. Implementation Strategy", "14"],
        ["5. Financial Assumptions", "17"],
        ["6. Key Recommendations", "20"],
        ["Appendix: Detailed Financial Projections", "22"],
    ]
    
    toc_table = Table(toc_data, colWidths=[5*inch, 0.5*inch])
    toc_table.setStyle(TableStyle([
        ('TEXTCOLOR', (0, 0), (-1, -1), DARK_BROWN),
        ('FONT', (0, 0), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 11),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
    ]))
    
    elements.append(toc_table)
    elements.append(PageBreak())
    
    # 1. Club Concept and Structure
    elements.append(Paragraph("1. Club Concept and Structure", styles['Heading2']))
    
    elements.append(Paragraph("Core Concept", styles['Heading3']))
    elements.append(Paragraph(
        """The Winner's Circle Club introduces a premium tier to Milea Estate's existing membership hierarchy, 
        sitting above the current Jumper, Grand Prix, and Triple Crown tiers. Unlike traditional allocation-based 
        wine clubs, the Winner's Circle operates on an innovative credit-based model where members pay $500 quarterly 
        ($2,000 annually), converted to an equivalent credit balance usable across the entire Milea ecosystem.""", 
        styles['Normal']
    ))
    
    elements.append(Paragraph(
        """This approach shifts the focus from purely wine acquisition to a comprehensive lifestyle experience that 
        encompasses fine wine, dining, accommodation, and exclusive events. The credit-based system provides members 
        with unprecedented flexibility while establishing a steady revenue stream for Milea Estate.""", 
        styles['Normal']
    ))
    
    # Pull quote
    elements.append(Paragraph(
        """The Winner's Circle represents a paradigm shift from traditional wine club models to a comprehensive 
        lifestyle membership that enhances customer engagement across multiple touchpoints.""", 
        styles['Quote']
    ))
    
    elements.append(Paragraph("Key Features and Benefits", styles['Heading3']))
    
    # Key features as narrative bullet points
    features = ListFlowable(
        [
            ListItem(Paragraph("""<b>Credit-Based Flexibility:</b> Members enjoy complete freedom to allocate their credits 
            according to their personal preferences, moving beyond traditional predetermined wine allocations to create 
            a truly customizable experience.""", styles['Normal'])),
            
            ListItem(Paragraph("""<b>Enhanced Value Proposition:</b> Members receive a substantial 20% discount on all purchases 
            across the entire Milea ecosystem, including wine acquisitions, culinary experiences, and luxury accommodations. 
            This comprehensive discount structure significantly enhances the overall value of membership.""", styles['Normal'])),
            
            ListItem(Paragraph("""<b>Diverse Redemption Options:</b> Credits can be applied to an extensive range of premium 
            offerings, including limited-release wines, exclusive culinary programs, luxury overnight accommodations, curated 
            merchandise, and special member-only events.""", styles['Normal'])),
            
            ListItem(Paragraph("""<b>Exclusive Access:</b> Members enjoy privileged access to premium facilities including 
            the private club lounge, temperature-controlled wine storage lockers, exclusive recreational facilities, and 
            extended access hours not available to general visitors.""", styles['Normal'])),
            
            ListItem(Paragraph("""<b>Premium Brand Positioning:</b> The exclusive nature and comprehensive benefits of the 
            Winner's Circle Club strengthen Milea's position as the premier luxury wine destination in the Hudson Valley 
            region.""", styles['Normal'])),
        ],
        bulletType='bullet',
        leftIndent=20
    )
    elements.append(features)
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph("Differentiation Factors", styles['Heading3']))
    elements.append(Paragraph(
        """The Winner's Circle Club stands apart from traditional wine club offerings in several key ways:""", 
        styles['Normal']
    ))
    
    differentiation = ListFlowable(
        [
            ListItem(Paragraph("<b>Lifestyle Focus vs. Product Focus:</b> Expands beyond wine to create a holistic vineyard lifestyle experience", styles['Normal'])),
            ListItem(Paragraph("<b>Flexibility vs. Allocation:</b> Member-directed spending rather than predetermined allocations", styles['Normal'])),
            ListItem(Paragraph("<b>Extended Ecosystem:</b> Encompasses accommodations, dining, and events in addition to wine", styles['Normal'])),
            ListItem(Paragraph("<b>Premium Positioning:</b> Creates a clear luxury tier within the Hudson Valley wine region", styles['Normal'])),
            ListItem(Paragraph("<b>Value Amplification:</b> Enhanced discounts and benefits increase perceived and actual value", styles['Normal'])),
        ],
        bulletType='bullet',
        leftIndent=20
    )
    elements.append(differentiation)
    
    elements.append(Paragraph("Target Demographics", styles['Heading3']))
    elements.append(Paragraph(
        """The Winner's Circle Club is designed to appeal to several distinct demographic segments:""", 
        styles['Normal']
    ))
    
    # Create pie chart for target segments
    drawing = Drawing(400, 200)
    pie = Pie()
    pie.x = 150
    pie.y = 50
    pie.width = 150
    pie.height = 150
    pie.data = [40, 25, 20, 15]
    pie.labels = ['Affluent Local Residents', 'NYC Weekend Travelers', 'Wine Enthusiasts', 'Corporate Members']
    
    pie.slices.strokeWidth = 0.5
    pie.slices[0].fillColor = PRIMARY_COLOR
    pie.slices[1].fillColor = SECONDARY_COLOR
    pie.slices[2].fillColor = ACCENT_COLOR
    pie.slices[3].fillColor = LIGHT_COLOR
    
    drawing.add(pie)
    elements.append(drawing)
    elements.append(Paragraph("Target Member Demographics", styles['Caption']))
    
    elements.append(Paragraph(
        """<b>Affluent Local Residents (40%):</b> High-income professionals within a 30-mile radius seeking regular 
        access to premium experiences without traveling to NYC or other wine regions.""", 
        styles['Normal']
    ))
    
    elements.append(Paragraph(
        """<b>NYC Weekend Travelers (25%):</b> Urban dwellers with second homes or frequent weekend trips to Hudson 
        Valley who want consistent, high-quality experiences during their visits.""", 
        styles['Normal']
    ))
    
    elements.append(Paragraph(
        """<b>Wine Enthusiasts (20%):</b> Serious collectors and oenophiles attracted by the quality of Milea's wines 
        and the exclusivity of limited releases and library access.""", 
        styles['Normal']
    ))
    
    elements.append(Paragraph(
        """<b>Corporate Members (15%):</b> Businesses seeking executive retreats, client entertainment options, and 
        corporate gifting solutions with a premium, local focus.""", 
        styles['Normal']
    ))
    
    elements.append(PageBreak())
    
    # 2. Membership Growth Projections
    elements.append(Paragraph("2. Membership Growth Projections", styles['Heading2']))
    
    elements.append(Paragraph("Growth Assumptions", styles['Heading3']))
    elements.append(Paragraph(
        """Membership growth for the Winner's Circle Club is projected based on two primary sources: 
        upgrades from existing wine club members and conversions from non-club visitors to the winery.""", 
        styles['Normal']
    ))
    
    # Create a table for growth assumptions
    assumption_data = [
        ["Assumptions", "Year 1", "Year 2", "Year 3", "Year 4"],
        ["Upgrade of existing club members", "4%\n(24 members)", "2%\n(14 members)", "2%\n(14 members)", "2%\n(14 members)"],
        ["Conversion of non-club visitors", "0.5%\n(40 members)", "1%\n(80 members)", "1%\n(80 members)", "1%\n(80 members)"],
        ["Total new members", "64", "94", "94", "94"],
        ["Cumulative membership", "64", "148", "220", "281"],
    ]
    
    assumption_table = Table(assumption_data)
    assumption_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY_COLOR),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
        ('FONT', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 11),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 10),
        ('BACKGROUND', (0, 1), (0, -1), LIGHT_COLOR),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.lightgrey),
        ('ALIGN', (1, 1), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    
    elements.append(assumption_table)
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph("Membership Growth Chart", styles['Heading3']))
    
    # Create bar chart for membership growth
    drawing = Drawing(500, 250)
    chart = VerticalBarChart()
    chart.x = 50
    chart.y = 50
    chart.height = 150
    chart.width = 400
    chart.data = [[80, 190, 285, 370]]
    chart.categoryAxis.categoryNames = ['Year 1', 'Year 2', 'Year 3', 'Year 4']
    chart.valueAxis.valueMin = 0
    chart.valueAxis.valueMax = 400
    chart.valueAxis.valueStep = 100
    chart.bars[0].fillColor = PRIMARY_COLOR
    
    # Set bar labels format
    chart.barLabelFormat = '%s'
    
    # Custom value axis labels
    chart.valueAxis.labelTextFormat = '%s'
    
    drawing.add(chart)
    elements.append(drawing)
    elements.append(Paragraph("Projected Member Growth by Year", styles['Caption']))
    
    elements.append(Paragraph("Membership Composition", styles['Heading3']))
    elements.append(Paragraph(
        """The chart below illustrates the projected breakdown between upgrades from existing club members 
        and new conversions from winery visitors:""", 
        styles['Normal']
    ))
    
    # Create a line chart showing the composition breakdown
    drawing = Drawing(500, 250)
    chart = HorizontalLineChart()
    chart.x = 50
    chart.y = 50
    chart.height = 150
    chart.width = 400
    chart.data = [
        [24, 38, 52, 66],  # Upgrades
        [40, 110, 168, 215],  # New conversions
    ]
    chart.categoryAxis.categoryNames = ['Year 1', 'Year 2', 'Year 3', 'Year 4']
    chart.valueAxis.valueMin = 0
    chart.valueAxis.valueMax = 250
    chart.valueAxis.valueStep = 50
    chart.lines[0].strokeColor = PRIMARY_COLOR
    chart.lines[0].strokeWidth = 2
    chart.lines[0].symbol = makeMarker('Circle')
    chart.lines[1].strokeColor = SECONDARY_COLOR
    chart.lines[1].strokeWidth = 2
    chart.lines[1].symbol = makeMarker('FilledSquare')
    
    # Add legend
    legend = Legend()
    legend.alignment = 'right'
    legend.x = 400
    legend.y = 220
    legend.colorNamePairs = [(PRIMARY_COLOR, 'Upgrades from Existing Members'),
                           (SECONDARY_COLOR, 'New Conversions')]
    drawing.add(chart)
    drawing.add(legend)
    
    elements.append(drawing)
    elements.append(Paragraph("Member Composition by Source", styles['Caption']))
    
    elements.append(Paragraph("Retention Strategy", styles['Heading3']))
    elements.append(Paragraph(
        """A key factor in the success of the Winner's Circle Club is maintaining high retention rates through 
        exceptional service and continuous enhancement of the value proposition. We project a 92% annual renewal rate 
        based on the following retention strategies:""", 
        styles['Normal']
    ))
    
    retention = ListFlowable(
        [
            ListItem(Paragraph("<b>Personalized Experiences:</b> Customized offerings based on member preferences and history", styles['Normal'])),
            ListItem(Paragraph("<b>Exclusive Access:</b> Regular introduction of new benefits, experiences, and products available only to Winner's Circle members", styles['Normal'])),
            ListItem(Paragraph("<b>Recognition Program:</b> Tiered recognition within the club based on tenure and spending", styles['Normal'])),
            ListItem(Paragraph("<b>Community Building:</b> Fostering connections among members through exclusive events and forums", styles['Normal'])),
            ListItem(Paragraph("<b>Regular Engagement:</b> Consistent, meaningful communications that provide value beyond promotional content", styles['Normal'])),
        ],
        bulletType='bullet',
        leftIndent=20
    )
    elements.append(retention)
    
    elements.append(PageBreak())
    
    # 3. Revenue Analysis
    elements.append(Paragraph("3. Revenue Analysis", styles['Heading2']))
    
    elements.append(Paragraph("Revenue Streams", styles['Heading3']))
    elements.append(Paragraph(
        """The Winner's Circle Club generates revenue through three primary channels:""", 
        styles['Normal']
    ))
    
    elements.append(Paragraph(
        """<b>1. Direct Membership Credits:</b> The core $2,000 annual membership fee converted to usable credits""", 
        styles['Normal']
    ))
    
    elements.append(Paragraph(
        """<b>2. Beyond-Credit Purchases:</b> Additional spending beyond the initial credit allocation, estimated at 20% of direct credit value""", 
        styles['Normal']
    ))
    
    elements.append(Paragraph(
        """<b>3. Accommodation Revenue:</b> Income from member stays at the Staatsburg House, projected at 10% utilization with a $300 per night average rate""", 
        styles['Normal']
    ))
    
    # Create a table for revenue projections
    revenue_data = [
        ["Year", "Members", "Direct Membership", "Beyond-Credit Purchases", "Accommodation", "Total Revenue"],
        ["1", "64", "$128,000", "$25,600", "$5,760", "$159,360"],
        ["2", "148", "$296,000", "$59,360", "$13,356", "$369,516"],
        ["3", "220", "$440,280", "$88,056", "$19,812", "$548,148"],
        ["4", "281", "$562,238", "$112,447", "$25,300", "$699,986"],
    ]
    
    revenue_table = Table(revenue_data)
    revenue_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY_COLOR),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
        ('FONT', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
        ('ALIGN', (1, 1), (-1, -1), 'CENTER'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.lightgrey),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BACKGROUND', (0, 1), (0, -1), LIGHT_COLOR),
        ('BACKGROUND', (-1, 1), (-1, -1), colors.lightgrey),
    ]))
    
    elements.append(revenue_table)
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph("Revenue Growth Trajectory", styles['Heading3']))
    
    # Create a bar chart for revenue growth
    drawing = Drawing(500, 250)
    chart = VerticalBarChart()
    chart.x = 50
    chart.y = 50
    chart.height = 150
    chart.width = 400
    chart.data = [[159360, 369516, 548148, 699986]]
    chart.categoryAxis.categoryNames = ['Year 1', 'Year 2', 'Year 3', 'Year 4']
    chart.valueAxis.valueMin = 0
    chart.valueAxis.valueMax = 800000
    chart.valueAxis.valueStep = 200000
    chart.bars[0].fillColor = PRIMARY_COLOR
    
    # Set bar labels format
    chart.barLabelFormat = '$%s'
    
    # Custom value axis labels
    chart.valueAxis.labelTextFormat = '$%s'
    
    drawing.add(chart)
    elements.append(drawing)
    elements.append(Paragraph("Total Projected Revenue by Year", styles['Caption']))
    
    elements.append(Paragraph("Revenue Composition", styles['Heading3']))
    elements.append(Paragraph(
        """The following chart illustrates the breakdown of revenue streams over the projected four-year period:""", 
        styles['Normal']
    ))
    
    # Create a stacked bar chart for revenue composition
    drawing = Drawing(500, 250)
    chart = VerticalBarChart()
    chart.x = 50
    chart.y = 50
    chart.height = 150
    chart.width = 400
    chart.data = [
        [128000, 296000, 440280, 562238],  # Direct Membership
        [25600, 59360, 88056, 112447],    # Beyond-Credit
        [5760, 13356, 19812, 25300]      # Accommodation
    ]
    chart.categoryAxis.categoryNames = ['Year 1', 'Year 2', 'Year 3', 'Year 4']
    chart.valueAxis.valueMin = 0
    chart.valueAxis.valueMax = 800000
    chart.valueAxis.valueStep = 200000
    chart.bars[0].fillColor = PRIMARY_COLOR
    chart.bars[1].fillColor = SECONDARY_COLOR
    chart.bars[2].fillColor = ACCENT_COLOR
    
    # Explicitly set barLabels to None for stacked chart
    chart.barLabels = None
    
    # Add stacked option
    chart.categoryAxis.style = 'stacked'
    
    # Custom value axis labels
    chart.valueAxis.labelTextFormat = '$%s'
    
    # Add legend
    legend = Legend()
    legend.alignment = 'right'
    legend.x = 400
    legend.y = 220
    legend.colorNamePairs = [(PRIMARY_COLOR, 'Direct Membership'),
                           (SECONDARY_COLOR, 'Beyond-Credit Purchases'),
                           (ACCENT_COLOR, 'Accommodation')]
    
    drawing.add(chart)
    drawing.add(legend)
    elements.append(drawing)
    elements.append(Paragraph("Revenue Composition by Stream", styles['Caption']))
    
    elements.append(Paragraph("Financial Impact", styles['Heading3']))
    elements.append(Paragraph(
        """The Winner's Circle Club represents a significant financial opportunity for Milea Estate, 
        with the following key impacts:""", 
        styles['Normal']
    ))
    
    impact = ListFlowable(
        [
            ListItem(Paragraph("<b>Revenue Growth:</b> 339% increase in revenue from Year 1 to Year 4", styles['Normal'])),
            ListItem(Paragraph("<b>Enhanced Lifetime Value:</b> Member lifetime value increases from $1,920 for traditional club members to $8,000 for Winner's Circle members", styles['Normal'])),
            ListItem(Paragraph("<b>Revenue Diversification:</b> Creates substantial non-wine revenue streams through accommodations and experiences", styles['Normal'])),
            ListItem(Paragraph("<b>Return on Investment:</b> Projects a payback period of approximately 28 months on the initial investment", styles['Normal'])),
            ListItem(Paragraph("<b>Brand Premium Effect:</b> Strengthens premium positioning, potentially increasing pricing power across all products", styles['Normal'])),
        ],
        bulletType='bullet',
        leftIndent=20
    )
    elements.append(impact)
    
    elements.append(PageBreak())
    
    # 4. Implementation Strategy
    elements.append(Paragraph("4. Implementation Strategy", styles['Heading2']))
    
    elements.append(Paragraph("Phased Implementation", styles['Heading3']))
    elements.append(Paragraph(
        """The Winner's Circle Club will be implemented in three distinct phases to ensure operational readiness, 
        minimize disruption, and optimize the member experience:""", 
        styles['Normal']
    ))
    
    # Phase 1: Preparation
    elements.append(Paragraph("Phase 1: Preparation (Months 1-3)", styles['Heading3']))
    elements.append(Paragraph(
        """This initial phase focuses on establishing the operational foundation for the club.""", 
        styles['Normal']
    ))
    
    phase1 = ListFlowable(
        [
            ListItem(Paragraph("<b>Infrastructure Planning:</b> Finalize plans for club lounge, wine lockers, and other physical facilities", styles['Normal'])),
            ListItem(Paragraph("<b>Technology Development:</b> Implement credit tracking system and member portal", styles['Normal'])),
            ListItem(Paragraph("<b>Staffing:</b> Hire and train dedicated Club Manager to oversee the program", styles['Normal'])),
            ListItem(Paragraph("<b>Marketing Materials:</b> Develop branding, collateral, and digital assets", styles['Normal'])),
            ListItem(Paragraph("<b>Membership Structure:</b> Finalize pricing, benefits, and redemption policies", styles['Normal'])),
        ],
        bulletType='bullet',
        leftIndent=20
    )
    elements.append(phase1)
    
    # Phase 2: Soft Launch
    elements.append(Paragraph("Phase 2: Soft Launch (Months 4-6)", styles['Heading3']))
    elements.append(Paragraph(
        """The soft launch phase introduces the club to a limited audience of existing premium members.""", 
        styles['Normal']
    ))
    
    phase2 = ListFlowable(
        [
            ListItem(Paragraph("<b>Initial Member Recruitment:</b> Target and convert top tier existing members", styles['Normal'])),
            ListItem(Paragraph("<b>Facilities Completion:</b> Complete club lounge and essential infrastructure", styles['Normal'])),
            ListItem(Paragraph("<b>Experience Testing:</b> Refinement of member journey and service standards", styles['Normal'])),
            ListItem(Paragraph("<b>System Optimization:</b> Troubleshoot technology and operational processes", styles['Normal'])),
            ListItem(Paragraph("<b>Feedback Collection:</b> Gather and implement early member suggestions", styles['Normal'])),
        ],
        bulletType='bullet',
        leftIndent=20
    )
    elements.append(phase2)
    
    # Phase 3: Full Implementation
    elements.append(Paragraph("Phase 3: Full Implementation (Months 7-12)", styles['Heading3']))
    elements.append(Paragraph(
        """The final phase scales the program to its full operational capacity.""", 
        styles['Normal']
    ))
    
    phase3 = ListFlowable(
        [
            ListItem(Paragraph("<b>Full Market Launch:</b> Open general enrollment and implement marketing campaign", styles['Normal'])),
            ListItem(Paragraph("<b>Complete Infrastructure:</b> Finalize all physical facilities and technology integration", styles['Normal'])),
            ListItem(Paragraph("<b>Staff Expansion:</b> Add support personnel as membership grows", styles['Normal'])),
            ListItem(Paragraph("<b>Programming Enhancement:</b> Establish full calendar of member events and experiences", styles['Normal'])),
            ListItem(Paragraph("<b>Continuous Improvement:</b> Implement feedback mechanisms and refinement processes", styles['Normal'])),
        ],
        bulletType='bullet',
        leftIndent=20
    )
    elements.append(phase3)
    
    elements.append(Paragraph("Resource Requirements", styles['Heading3']))
    elements.append(Paragraph(
        """Successful implementation of the Winner's Circle Club will require the following key investments:""", 
        styles['Normal']
    ))
    
    # Create a table for resource requirements
    resource_data = [
        ["Category", "Investment", "Details"],
        ["Physical Infrastructure", "$175,000", "Club lounge, wine lockers, biometric access"],
        ["Technology Systems", "$62,500", "Credit platform, member portal, reservations"],
        ["Staffing", "$85,000", "Club Manager (shared operations)"],
        ["Operations", "$87,500", "Inventory, service provisions, marketing"],
        ["Total Investment", "$410,000", "First-year capital and operational expenses"],
    ]
    
    resource_table = Table(resource_data, colWidths=[2*inch, 1.25*inch, 3.5*inch])
    resource_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY_COLOR),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
        ('FONT', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
        ('ALIGN', (1, 1), (1, -1), 'RIGHT'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.lightgrey),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BACKGROUND', (0, -1), (-1, -1), LIGHT_COLOR),
        ('FONT', (0, -1), (-1, -1), 'Helvetica-Bold'),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('WORDWRAP', (0, 0), (-1, -1), True),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
    ]))
    
    elements.append(resource_table)
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph("Implementation Milestones", styles['Heading3']))
    
    # Create a timeline visualization
    timeline_data = [
        ["Month 1-2", "Infrastructure planning & initial staffing"],
        ["Month 3", "Technology development & membership structure finalization"],
        ["Month 4", "Soft launch to select existing members"],
        ["Month 5-6", "Refinement based on initial member feedback"],
        ["Month 7-8", "Full market launch & marketing campaign"],
        ["Month 9-10", "Expansion of programming & experiences"],
        ["Month 11-12", "Optimization & preparation for Year 2 growth"],
    ]
    
    timeline_table = Table(timeline_data, colWidths=[1.25*inch, 4.75*inch])
    timeline_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), PRIMARY_COLOR),
        ('TEXTCOLOR', (0, 0), (0, -1), colors.white),
        ('ALIGN', (0, 0), (0, -1), 'CENTER'),
        ('FONT', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.lightgrey),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
    ]))
    
    elements.append(timeline_table)
    
    elements.append(PageBreak())
    
    # 5. Financial Assumptions
    elements.append(Paragraph("5. Financial Assumptions", styles['Heading2']))
    
    elements.append(Paragraph("Core Membership Assumptions", styles['Heading3']))
    elements.append(Paragraph(
        """Our financial projections are based on the following core assumptions regarding 
        membership growth and retention:""", 
        styles['Normal']
    ))
    
    # Core membership assumptions as bullet points
    core_assumptions = ListFlowable(
        [
            ListItem(Paragraph("""<b>Initial Upgrade Rate:</b> We project 4% of existing club members will upgrade 
            during the initial launch phase, driven by targeted promotional efforts and early adopter incentives.""", 
            styles['Normal'])),
            
            ListItem(Paragraph("""<b>Ongoing Upgrade Rate:</b> Following the launch period, we expect a sustained 
            2% annual upgrade rate from existing club members, focusing on the most engaged current members who 
            demonstrate high utilization of current benefits.""", styles['Normal'])),
            
            ListItem(Paragraph("""<b>Initial Visitor Conversion:</b> A conservative 0.5% conversion rate of non-club 
            visitors is projected for Year 1, allowing time for program awareness to build and service standards 
            to be refined.""", styles['Normal'])),
            
            ListItem(Paragraph("""<b>Ongoing Visitor Conversion:</b> As program awareness grows and word-of-mouth 
            referrals increase, we project conversion rates to reach 1% of non-club visitors annually.""", 
            styles['Normal'])),
            
            ListItem(Paragraph("""<b>Annual Retention Rate:</b> Based on premium club industry benchmarks, we project 
            a 92% annual retention rate, supported by high-touch service and continuous value enhancement.""", 
            styles['Normal'])),
            
            ListItem(Paragraph("""<b>Growth Potential:</b> No membership cap has been applied as market analysis 
            indicates the program will not reach saturation within the initial 4-year projection period.""", 
            styles['Normal'])),
        ],
        bulletType='bullet',
        leftIndent=20
    )
    elements.append(core_assumptions)
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph("Revenue Assumptions", styles['Heading3']))
    elements.append(Paragraph(
        """Our revenue projections are built upon the following key assumptions:""", 
        styles['Normal']
    ))
    
    # Revenue assumptions as bullet points
    revenue_assumptions = ListFlowable(
        [
            ListItem(Paragraph("""<b>Annual Membership Fee:</b> Members will be charged $2,000 annually, structured 
            as quarterly payments of $500 to enhance affordability and cash flow management.""", styles['Normal'])),
            
            ListItem(Paragraph("""<b>Beyond-Credit Purchases:</b> Members are projected to spend an additional 20% 
            beyond their membership credits, driven by special events, limited releases, and premium experiences.""", 
            styles['Normal'])),
            
            ListItem(Paragraph("""<b>Accommodation Utilization:</b> We project 10% of members will utilize 
            accommodation benefits, with an average stay of 3 nights at $300 per night.""", styles['Normal'])),
            
            ListItem(Paragraph("""<b>Pricing Strategy:</b> Taking a conservative approach, no price increases are 
            projected during the initial 4-year period, though market conditions may present opportunities for 
            selective increases.""", styles['Normal'])),
            
            ListItem(Paragraph("""<b>Credit Utilization:</b> We assume 100% credit redemption, with no breakage 
            benefit factored into financial projections, ensuring conservative revenue estimates.""", 
            styles['Normal'])),
        ],
        bulletType='bullet',
        leftIndent=20
    )
    elements.append(revenue_assumptions)
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph("Cost Assumptions", styles['Heading3']))
    elements.append(Paragraph(
        """Our cost and investment projections are based on the following key assumptions:""", 
        styles['Normal']
    ))
    
    # Cost assumptions as bullet points
    cost_assumptions = ListFlowable(
        [
            ListItem(Paragraph("""<b>Club Management:</b> A dedicated Club Manager position will be created with 
            an annual salary of $85,000, with responsibilities shared across Milea Estate and Hudson Valley 
            Vineyards to optimize resource utilization.""", styles['Normal'])),
            
            ListItem(Paragraph("""<b>Staffing Efficiency:</b> The program is designed to operate without requiring 
            additional full-time employees beyond the Club Manager, leveraging the existing operational team 
            through enhanced training and systematic processes.""", styles['Normal'])),
            
            ListItem(Paragraph("""<b>Physical Infrastructure:</b> A one-time capital investment of $175,000 will 
            be required for facilities development, including the club lounge, wine storage lockers, and member 
            access systems.""", styles['Normal'])),
            
            ListItem(Paragraph("""<b>Technology Investment:</b> An initial investment of $62,500 will be allocated 
            for technology systems, including the credit management platform, member portal, and integrated 
            reservation systems.""", styles['Normal'])),
            
            ListItem(Paragraph("""<b>Ongoing Operations:</b> Annual operating costs of $87,500 are projected for 
            marketing initiatives, facility maintenance, program materials, and ongoing member services.""", 
            styles['Normal'])),
        ],
        bulletType='bullet',
        leftIndent=20
    )
    elements.append(cost_assumptions)
    
    elements.append(PageBreak())
    
    # 6. Key Recommendations
    elements.append(Paragraph("6. Key Recommendations", styles['Heading2']))
    
    elements.append(Paragraph(
        """Based on our comprehensive analysis, we recommend the following key actions to ensure 
        the success of the Winner's Circle Club:""", 
        styles['Normal']
    ))
    
    elements.append(Paragraph("Strategic Recommendations", styles['Heading3']))
    
    strategic = ListFlowable(
        [
            ListItem(Paragraph("<b>Proceed with Implementation:</b> The financial projections and strategic benefits justify moving forward with the Winner's Circle concept", styles['Normal'])),
            ListItem(Paragraph("<b>Phased Approach:</b> Adopt the proposed three-phase implementation to minimize disruption and optimize the member experience", styles['Normal'])),
            ListItem(Paragraph("<b>Exclusive Positioning:</b> Maintain strict exclusivity to preserve the premium nature of the club", styles['Normal'])),
            ListItem(Paragraph("<b>Infrastructure Investment:</b> Prioritize physical space enhancements to create tangible value for members", styles['Normal'])),
            ListItem(Paragraph("<b>Dedicated Leadership:</b> Ensure the Club Manager position is filled with a hospitality professional who understands both wine and luxury service", styles['Normal'])),
        ],
        bulletType='bullet',
        leftIndent=20
    )
    elements.append(strategic)
    
    elements.append(Paragraph("Operational Recommendations", styles['Heading3']))
    
    operational = ListFlowable(
        [
            ListItem(Paragraph("<b>Technology First:</b> Prioritize the credit management system to ensure seamless tracking and redemption", styles['Normal'])),
            ListItem(Paragraph("<b>Experience Mapping:</b> Create detailed service blueprints for all touchpoints in the member journey", styles['Normal'])),
            ListItem(Paragraph("<b>Staff Training:</b> Implement comprehensive training for all team members who will interact with Winner's Circle members", styles['Normal'])),
            ListItem(Paragraph("<b>Feedback Mechanisms:</b> Establish formal and informal channels for member input throughout the implementation", styles['Normal'])),
            ListItem(Paragraph("<b>Metric Tracking:</b> Develop KPI dashboard to monitor critical success factors in real-time", styles['Normal'])),
        ],
        bulletType='bullet',
        leftIndent=20
    )
    elements.append(operational)
    
    elements.append(Paragraph("Marketing Recommendations", styles['Heading3']))
    
    marketing = ListFlowable(
        [
            ListItem(Paragraph("<b>Targeted Approach:</b> Focus initial marketing efforts on existing premium club members and high-value visitors", styles['Normal'])),
            ListItem(Paragraph("<b>Exclusivity Messaging:</b> Emphasize limited availability and exclusive access in all communications", styles['Normal'])),
            ListItem(Paragraph("<b>Experience Showcase:</b> Create compelling visual content highlighting the unique aspects of membership", styles['Normal'])),
            ListItem(Paragraph("<b>Referral Program:</b> Implement member incentives for successful referrals to accelerate growth", styles['Normal'])),
            ListItem(Paragraph("<b>Digital Integration:</b> Ensure a seamless online presence with easy application process", styles['Normal'])),
        ],
        bulletType='bullet',
        leftIndent=20
    )
    elements.append(marketing)
    
    elements.append(Paragraph("Risk Mitigation", styles['Heading3']))
    
    risks = ListFlowable(
        [
            ListItem(Paragraph("<b>Economic Sensitivity Plan:</b> Develop contingency strategies for potential economic downturns", styles['Normal'])),
            ListItem(Paragraph("<b>Scalable Infrastructure:</b> Design systems and spaces that can adjust to varying membership levels", styles['Normal'])),
            ListItem(Paragraph("<b>Value Enhancement:</b> Continuously evolve benefits to maintain perceived value", styles['Normal'])),
            ListItem(Paragraph("<b>Competitive Monitoring:</b> Establish systems to track similar offerings that may emerge in the region", styles['Normal'])),
            ListItem(Paragraph("<b>Financial Buffers:</b> Maintain conservative financial projections with appropriate reserves", styles['Normal'])),
        ],
        bulletType='bullet',
        leftIndent=20
    )
    elements.append(risks)
    
    elements.append(PageBreak())
    
    # Conclusion
    elements.append(Paragraph("Conclusion", styles['Heading2']))
    
    elements.append(Paragraph(
        """The Winner's Circle Club represents a strategic opportunity for Milea Estate to elevate its brand 
        positioning, substantially increase revenue, and create deeper relationships with its most valuable 
        customers. By transitioning from a traditional wine club model to a comprehensive lifestyle membership, 
        Milea can differentiate itself within the competitive Hudson Valley wine region while substantially 
        increasing the lifetime value of each member.""", 
        styles['Normal']
    ))
    
    elements.append(Paragraph(
        """Our financial analysis indicates strong revenue potential, with projected growth from $159,360 in Year 1 
        to $699,986 by Year 4. The investment requirements are significant but justified by the estimated 28-month 
        payback period and the strategic brand enhancement that will result.""", 
        styles['Normal']
    ))
    
    elements.append(Paragraph(
        """Through careful implementation following the phased approach outlined in this report, Milea Estate can 
        minimize operational disruption while creating an exceptional premium experience for members. The Winner's 
        Circle Club has the potential to transform Milea's business model while setting a new standard for wine 
        country experiences in the Hudson Valley region.""", 
        styles['Normal']
    ))
    
    elements.append(Spacer(1, 0.5*inch))
    
    elements.append(PageBreak())
    
    # Appendix - Financial details
    elements.append(Paragraph("Appendix: Detailed Financial Projections", styles['Heading2']))
    
    elements.append(Paragraph("Detailed Membership Growth Projections", styles['Heading3']))
    
    # Create a detailed membership projection table
    detailed_members = [
        ["Year", "Starting Members", "Upgrades", "New Conversions", "Attritions", "Net New", "Ending Total"],
        ["1", "0", "24", "40", "0", "64", "64"],
        ["2", "64", "14", "80", "5", "89", "153"],
        ["3", "153", "14", "80", "12", "82", "235"],
        ["4", "235", "14", "80", "19", "75", "310"],
    ]
    
    members_table = Table(detailed_members)
    members_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY_COLOR),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
        ('FONT', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
        ('ALIGN', (1, 1), (-1, -1), 'CENTER'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.lightgrey),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BACKGROUND', (0, 1), (0, -1), LIGHT_COLOR),
    ]))
    
    elements.append(members_table)
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph("Detailed Revenue Projections", styles['Heading3']))
    
    # Create a detailed revenue table
    detailed_revenue = [
        ["Year", "Members", "Direct Membership", "Beyond-Credit (20%)", "Accommodation", "Total Revenue", "YoY Growth"],
        ["1", "64", "$128,000", "$25,600", "$5,760", "$159,360", "—"],
        ["2", "153", "$306,000", "$61,200", "$13,770", "$380,970", "139.1%"],
        ["3", "235", "$470,000", "$94,000", "$21,150", "$585,150", "53.6%"],
        ["4", "310", "$620,000", "$124,000", "$27,900", "$771,900", "31.9%"],
        ["Total", "—", "$1,524,000", "$304,800", "$68,580", "$1,897,380", "—"],
    ]
    
    revenue_detail_table = Table(detailed_revenue)
    revenue_detail_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY_COLOR),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
        ('FONT', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
        ('ALIGN', (1, 1), (-1, -1), 'RIGHT'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.lightgrey),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BACKGROUND', (0, 1), (0, -1), LIGHT_COLOR),
        ('BACKGROUND', (0, -1), (-1, -1), colors.lightgrey),
        ('FONT', (0, -1), (-1, -1), 'Helvetica-Bold'),
    ]))
    
    elements.append(revenue_detail_table)
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph("Investment and Returns Analysis", styles['Heading3']))
    
    # Create an ROI analysis table
    roi_data = [
        ["Category", "Year 1", "Year 2", "Year 3", "Year 4", "Total"],
        ["Revenue", "$159,360", "$380,970", "$585,150", "$771,900", "$1,897,380"],
        ["Initial Investment", "$(410,000)", "—", "—", "—", "$(410,000)"],
        ["Ongoing Costs", "$(87,500)", "$(90,125)", "$(92,829)", "$(95,613)", "$(366,067)"],
        ["Net Cash Flow", "$(338,140)", "$290,845", "$492,321", "$676,287", "$1,121,313"],
        ["Cumulative Cash Flow", "$(338,140)", "$(47,295)", "$445,026", "$1,121,313", "—"],
    ]
    
    roi_table = Table(roi_data)
    roi_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY_COLOR),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
        ('FONT', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
        ('ALIGN', (1, 1), (-1, -1), 'RIGHT'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.lightgrey),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BACKGROUND', (0, 1), (0, -1), LIGHT_COLOR),
        ('BACKGROUND', (0, -1), (-1, -1), colors.lightgrey),
        ('FONT', (0, -1), (-1, -1), 'Helvetica-Bold'),
    ]))
    
    elements.append(roi_table)
    elements.append(Spacer(1, 0.2*inch))
    
    elements.append(Paragraph(
        """ROI Analysis Summary: The Winner's Circle Club is projected to reach a positive cumulative cash flow 
        in Year 3, with a payback period of approximately 28 months from initial investment. By Year 4, the 
        cumulative cash flow reaches $1,121,313, representing a robust return on the initial investment.""", 
        styles['Normal']
    ))
    
    # Build the document
    doc.build(elements)
    
    print(f"Report successfully generated: {output_filename}")
    return output_filename

# Create line chart for revenue growth
def prepare_revenue_chart():
    years = [1, 2, 3, 4]
    revenue = [159360, 380970, 585150, 771900]
    
    plt.figure(figsize=(8, 5))
    plt.plot(years, revenue, marker='o', linestyle='-', color='#0284c7', linewidth=2, markersize=8)
    plt.grid(True, linestyle='--', alpha=0.7)
    plt.title('Projected Revenue Growth', fontsize=14, fontweight='bold')
    plt.xlabel('Year', fontsize=12)
    plt.ylabel('Revenue ($)', fontsize=12)
    plt.xticks(years)
    
    # Format y-axis to show dollars
    from matplotlib.ticker import FuncFormatter
    def dollars(x, pos):
        return f'${x:,.0f}'
    plt.gca().yaxis.set_major_formatter(FuncFormatter(dollars))
    
    plt.tight_layout()
    plt.savefig('revenue_growth.png', dpi=300, bbox_inches='tight')
    return 'revenue_growth.png'

# If run as main script
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Generate Winners Circle Analysis Report')
    parser.add_argument('--output', type=str, default='Winners_Circle_Analysis.pdf',
                      help='Output PDF filename')
    args = parser.parse_args()
    
    output_pdf = create_winners_circle_report(args.output)
    print(f"PDF report generated: {output_pdf}")