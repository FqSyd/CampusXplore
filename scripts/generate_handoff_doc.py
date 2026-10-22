import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=140, bottom=140, left=180, right=180):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(
        f'<w:tcMar {nsdecls("w")}>'
        f'<w:top w:w="{top}" w:type="dxa"/>'
        f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
        f'<w:left w:w="{left}" w:type="dxa"/>'
        f'<w:right w:w="{right}" w:type="dxa"/>'
        f'</w:tcMar>'
    )
    tcPr.append(tcMar)

def set_cell_border_left_only(cell, color_hex="1E3A8A", sz="36"):
    tcPr = cell._tc.get_or_add_tcPr()
    borders = parse_xml(
        f'<w:tcBorders {nsdecls("w")}>'
        f'<w:top w:val="none"/>'
        f'<w:left w:val="single" w:sz="{sz}" w:space="0" w:color="{color_hex}"/>'
        f'<w:bottom w:val="none"/>'
        f'<w:right w:val="none"/>'
        f'</w:tcBorders>'
    )
    tcPr.append(borders)

def set_table_borders(table, color_hex="CBD5E1"):
    tblPr = table._tbl.tblPr
    borders = parse_xml(
        f'<w:tblBorders {nsdecls("w")}>'
        f'<w:top w:val="single" w:sz="6" w:space="0" w:color="{color_hex}"/>'
        f'<w:bottom w:val="single" w:sz="8" w:space="0" w:color="{color_hex}"/>'
        f'<w:insideH w:val="single" w:sz="4" w:space="0" w:color="{color_hex}"/>'
        f'<w:insideV w:val="none"/>'
        f'<w:left w:val="none"/>'
        f'<w:right w:val="none"/>'
        f'</w:tblBorders>'
    )
    tblPr.append(borders)

def create_document():
    doc = Document()

    # Page Margins
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)

    # Styles setup
    style_normal = doc.styles['Normal']
    style_normal.font.name = 'Calibri'
    style_normal.font.size = Pt(11)
    style_normal.font.color.rgb = RGBColor(31, 41, 55) # Slate-800
    style_normal.paragraph_format.line_spacing = 1.15
    style_normal.paragraph_format.space_after = Pt(6)

    # Colors
    NAVY = RGBColor(30, 58, 138)       # #1E3A8A
    SLATE_DARK = RGBColor(15, 23, 42)  # #0F172A
    TEAL = RGBColor(13, 148, 136)      # #0D9488
    GRAY_TEXT = RGBColor(100, 116, 139)# #64748B
    WHITE = RGBColor(255, 255, 255)

    # ==========================================
    # COVER / HEADER BANNER
    # ==========================================
    title_p = doc.add_paragraph()
    title_p.paragraph_format.space_before = Pt(0)
    title_p.paragraph_format.space_after = Pt(2)
    run_brand = title_p.add_run("CAMPUSXPLORE")
    run_brand.font.name = 'Arial'
    run_brand.font.size = Pt(28)
    run_brand.font.bold = True
    run_brand.font.color.rgb = NAVY

    sub_p = doc.add_paragraph()
    sub_p.paragraph_format.space_before = Pt(0)
    sub_p.paragraph_format.space_after = Pt(14)
    run_sub = sub_p.add_run("Smart Campus Navigation System Using the A* (A-Star) Algorithm")
    run_sub.font.name = 'Calibri'
    run_sub.font.size = Pt(15)
    run_sub.font.color.rgb = TEAL
    run_sub.font.bold = True

    desc_p = doc.add_paragraph()
    desc_p.paragraph_format.space_after = Pt(16)
    run_desc = desc_p.add_run(
        "Project Handoff & Architecture Guide — Everything you need to understand, demonstrate, and explain the project to friends, teammates, and evaluators."
    )
    run_desc.font.size = Pt(11.5)
    run_desc.font.italic = True
    run_desc.font.color.rgb = GRAY_TEXT

    # Meta Info Card / Table
    meta_table = doc.add_table(rows=4, cols=2)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_data = [
        ("Project Name:", "CampusXplore (Smart Campus Navigation)"),
        ("Core Technology:", "React 18 + TypeScript + Three.js / React Three Fiber + Tailwind CSS"),
        ("Primary Algorithm:", "A* (A-Star) Heuristic Graph Pathfinding with Dynamic Rerouting"),
        ("Key Highlights:", "3D Simulation, 2D Topographic Map, 3D Walking Avatar, Real-time Pathway Alerts")
    ]
    for row_idx, (k, v) in enumerate(meta_data):
        row = meta_table.rows[row_idx]
        cell_k, cell_v = row.cells[0], row.cells[1]
        cell_k.width = Inches(2.0)
        cell_v.width = Inches(4.5)
        set_cell_margins(cell_k, top=80, bottom=80, left=100, right=100)
        set_cell_margins(cell_v, top=80, bottom=80, left=100, right=100)
        set_cell_background(cell_k, "F8FAFC")
        set_cell_background(cell_v, "FFFFFF")

        pk = cell_k.paragraphs[0]
        pk.paragraph_format.space_after = Pt(0)
        rk = pk.add_run(k)
        rk.font.bold = True
        rk.font.size = Pt(10)
        rk.font.color.rgb = NAVY

        pv = cell_v.paragraphs[0]
        pv.paragraph_format.space_after = Pt(0)
        rv = pv.add_run(v)
        rv.font.size = Pt(10)
        rv.font.color.rgb = SLATE_DARK
    
    set_table_borders(meta_table, "E2E8F0")

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # Helper function for Section Headings
    def add_h1(text):
        h = doc.add_paragraph()
        h.paragraph_format.space_before = Pt(18)
        h.paragraph_format.space_after = Pt(6)
        h.paragraph_format.keep_with_next = True
        run = h.add_run(text)
        run.font.name = 'Arial'
        run.font.size = Pt(16)
        run.font.bold = True
        run.font.color.rgb = NAVY
        return h

    def add_h2(text):
        h = doc.add_paragraph()
        h.paragraph_format.space_before = Pt(14)
        h.paragraph_format.space_after = Pt(4)
        h.paragraph_format.keep_with_next = True
        run = h.add_run(text)
        run.font.name = 'Calibri'
        run.font.size = Pt(13)
        run.font.bold = True
        run.font.color.rgb = TEAL
        return h

    def add_callout(text, bold_prefix="Key Takeaway: "):
        table = doc.add_table(rows=1, cols=1)
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        cell = table.rows[0].cells[0]
        cell.width = Inches(6.5)
        set_cell_background(cell, "F0F9FF") # light blue/cyan
        set_cell_margins(cell, top=140, bottom=140, left=180, right=180)
        set_cell_border_left_only(cell, color_hex="0284C7", sz="32")
        p = cell.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        if bold_prefix:
            rb = p.add_run(bold_prefix)
            rb.font.bold = True
            rb.font.color.rgb = RGBColor(2, 132, 199)
        rt = p.add_run(text)
        rt.font.size = Pt(10.5)
        rt.font.color.rgb = SLATE_DARK
        p_sp = doc.add_paragraph()
        p_sp.paragraph_format.space_after = Pt(6)

    # ==========================================
    # SECTION 1: EXECUTIVE SUMMARY
    # ==========================================
    add_h1("1. Executive Summary & Project Purpose")
    
    p = doc.add_paragraph()
    p.add_run(
        "CampusXplore is an interactive, web-based intelligent campus navigation system developed using Artificial Intelligence pathfinding principles. "
        "It provides students, faculty, and campus visitors with an optimal walking route between buildings on a university campus while seamlessly avoiding physical obstacles and respecting temporary walkway disruptions."
    )

    add_h2("Why Did We Build CampusXplore? (The Real-World Problem)")
    p = doc.add_paragraph()
    p.add_run(
        "Commercial mapping solutions like Google Maps or Apple Maps work well for vehicular city streets, but they suffer from major limitations on academic campuses:"
    )

    b1 = doc.add_paragraph(style='List Bullet')
    r = b1.add_run("No Pedestrian-Only Walkways: ")
    r.font.bold = True
    b1.add_run("Commercial maps often lack internal pedestrian pathways, courtyards, promenades, and plazas connecting campus facilities.")

    b2 = doc.add_paragraph(style='List Bullet')
    r = b2.add_run("No Entrance-Level Accuracy: ")
    r.font.bold = True
    b2.add_run("Navigation to a large building (e.g., Central Library or Admin Block) often dumps the visitor at the building's geometric center or a parking lot, rather than guiding them to the actual walkable entrance door.")

    b3 = doc.add_paragraph(style='List Bullet')
    r = b3.add_run("Lack of Temporary Event / Maintenance Awareness: ")
    r.font.bold = True
    b3.add_run("Campuses frequently host sports fests, cultural events, pathway maintenance, and construction work that temporarily shut down walking routes.")

    b4 = doc.add_paragraph(style='List Bullet')
    r = b4.add_run("Black-Box Mystery: ")
    r.font.bold = True
    b4.add_run("Commercial systems never show students how pathfinding algorithms actually evaluate choices, calculate heuristics, or dynamically adapt to real-time obstacles.")

    add_callout(
        "CampusXplore solves these issues by combining a true pedestrian navigation graph with a realistic 3D campus simulation, a live 3D walking character, and a transparent A* algorithm visualizer that reacts instantly to pathway closures.",
        bold_prefix="Core Mission: "
    )

    # ==========================================
    # SECTION 2: THE A* PATHFINDING ALGORITHM
    # ==========================================
    add_h1("2. Core AI Algorithm: How A* (A-Star) Works")

    p = doc.add_paragraph()
    p.add_run(
        "At the heart of CampusXplore is the A* (A-Star) search algorithm, one of the most widely used and mathematically proven pathfinding algorithms in computer science, robotics, and game development."
    )

    add_h2("The Evaluation Function: f(n) = g(n) + h(n)")
    p = doc.add_paragraph()
    p.add_run(
        "At every step of navigation, A* decides which pathway node to explore next by evaluating three distinct cost factors:"
    )

    doc.add_paragraph(
        "1. g(n) — Exact Cost So Far:\n"
        "The exact, accumulated walking distance from the origin (Start Node) to the current node n along the walkable graph edges.",
        style='List Number'
    )
    doc.add_paragraph(
        "2. h(n) — Heuristic Estimate to Goal:\n"
        "An estimated straight-line (Euclidean) distance from current node n to the Destination entrance waypoint.\n"
        "Formula: h(n) = √((x_dest - x_n)² + (z_dest - z_n)²)",
        style='List Number'
    )
    doc.add_paragraph(
        "3. f(n) — Total Estimated Route Cost:\n"
        "The sum of both: f(n) = g(n) + h(n). The node with the smallest f(n) is extracted from the Open Set (priority queue) and expanded first.",
        style='List Number'
    )

    add_h2("Why A* is Superior to Dijkstra and BFS")
    
    comp_table = doc.add_table(rows=4, cols=4)
    comp_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    headers = ["Algorithm", "Considers Edge Distances?", "Uses Heuristic Guidance?", "Efficiency in Campus Navigation"]
    for i, h in enumerate(headers):
        cell = comp_table.rows[0].cells[i]
        set_cell_background(cell, "1E3A8A")
        set_cell_margins(cell, top=100, bottom=100, left=80, right=80)
        p = cell.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        run = p.add_run(h)
        run.font.bold = True
        run.font.size = Pt(9.5)
        run.font.color.rgb = WHITE

    rows_data = [
        ("Breadth-First Search (BFS)", "No (assumes equal cost per step)", "No (blind search)", "Poor: Finds fewest hops, not shortest walking meters."),
        ("Dijkstra's Algorithm", "Yes (calculates exact edge distance)", "No (searches blindly in every direction)", "Sub-optimal: Searches radially in circles, wasting CPU evaluating nodes far away from goal."),
        ("A* (A-Star) Algorithm", "Yes (exact distance g(n))", "Yes (Euclidean distance h(n))", "Optimal: Directly heads towards destination while mathematically guaranteeing the shortest path.")
    ]

    for r_idx, r_vals in enumerate(rows_data):
        row = comp_table.rows[r_idx + 1]
        bg = "F8FAFC" if r_idx % 2 == 0 else "FFFFFF"
        for c_idx, val in enumerate(r_vals):
            cell = row.cells[c_idx]
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=90, bottom=90, left=80, right=80)
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            r.font.size = Pt(9)
            if c_idx == 0:
                r.font.bold = True
                r.font.color.rgb = NAVY

    set_table_borders(comp_table, "CBD5E1")
    doc.add_paragraph().paragraph_format.space_after = Pt(6)

    add_h2("Mathematical Guarantee: Admissibility and Consistency")
    p = doc.add_paragraph()
    p.add_run(
        "A heuristic is admissible if it never overestimates the actual cost to reach the goal (i.e., h(n) ≤ actual distance). "
        "Because the straight-line Euclidean distance in 3D/2D space is the geometric shortest possible distance between two points, "
        "our heuristic is both admissible and consistent. This guarantees that A* will always return the provably optimal (shortest) walkable route."
    )

    # ==========================================
    # SECTION 3: CAMPUS GRAPH & SPATIAL DATA
    # ==========================================
    add_h1("3. Campus Representation & Graph Architecture")

    p = doc.add_paragraph()
    p.add_run(
        "Rather than treating the campus as a continuous free-space polygon grid, CampusXplore models the campus as a weighted, undirected spatial navigation graph: G = (V, E)."
    )

    b1 = doc.add_paragraph(style='List Bullet')
    r = b1.add_run("Vertices / Nodes (V): ")
    r.font.bold = True
    b1.add_run("Key waypoints across the campus, specifically placed at building entrance doors, pathway intersections, promenade junctions, and courtyard corners. Each node stores its 3D coordinate (x, y, z).")

    b2 = doc.add_paragraph(style='List Bullet')
    r = b2.add_run("Edges (E): ")
    r.font.bold = True
    b2.add_run("Walkable path segments connecting adjacent nodes. Each edge holds a weight equal to the true Euclidean distance in meters, representing real-world walking difficulty.")

    b3 = doc.add_paragraph(style='List Bullet')
    r = b3.add_run("Building Entrance Mapping: ")
    r.font.bold = True
    b3.add_run("Every campus building has a registered entrance waypoint node. When a user navigates to the 'Central Library', the algorithm targets the exact entrance node on the walkway network, never colliding with the building geometry.")

    b4 = doc.add_paragraph(style='List Bullet')
    r = b4.add_run("Physical Obstacle Clearance: ")
    r.font.bold = True
    b4.add_run("The campus contains 17 permanent structures (academic blocks, hostels, sports complex, cafeteria, green zones). All 55 walkable graph edges are mathematically verified to have zero intersection with obstacle bounding boxes, ensuring realistic pedestrian paths.")

    # ==========================================
    # SECTION 4: KEY FEATURES & USER EXPERIENCE
    # ==========================================
    add_h1("4. Key Features & Interactive Capabilities")

    p = doc.add_paragraph()
    p.add_run("CampusXplore delivers an engaging, modern user experience designed for effortless demonstration:")

    add_h2("A. Interactive 3D Campus Simulation (Three.js / WebGL)")
    p = doc.add_paragraph()
    p.add_run(
        "Built using React Three Fiber and Three.js. It renders 3D building models with distinct architecture, roads, paved pedestrian walks, green grass lawns, 3D trees, dynamic ambient lighting, and glowing navigation markers (Green for START, Red for DESTINATION)."
    )

    add_h2("B. Full 2D Topographic Map Mode")
    p = doc.add_paragraph()
    p.add_run(
        "Users can switch cleanly between the 3D world and a 2D architectural blueprint map. The 2D view displays the complete waypoint node graph, path segments, and active route lines without confusing floating overlays."
    )

    add_h2("C. 3D Walking Character Locomotion & Progress HUD")
    p = doc.add_paragraph()
    p.add_run(
        "Once a route is computed, an animated 3D walking avatar appears at the origin entrance waypoint and walks along the computed A* path step-by-step. "
        "A live Navigation HUD tracks real-time walking percentage (0% to 100%), remaining distance countdown (in meters), and estimated walking time (based on average pedestrian speed of 1.4 m/s). When the destination is reached, an arrival badge confirms completion."
    )

    add_h2("D. Dynamic Camera Controls (Including 3rd-Person Follow Walker)")
    p = doc.add_paragraph()
    p.add_run(
        "The bottom control bar gives instant perspective switching:"
    )
    doc.add_paragraph("• Default Orbit: Freely rotate, pan, and zoom around the campus.", style='List Bullet')
    doc.add_paragraph("• Bird's Eye (Top-Down): Direct overhead 90-degree view for tactical campus overview.", style='List Bullet')
    doc.add_paragraph("• Focus Start / Focus Destination: Instantly pans the camera to inspect building entrances.", style='List Bullet')
    doc.add_paragraph("• Follow Walker: A smooth third-person tracking camera that locks onto the walking character as they traverse pathways.", style='List Bullet')

    add_h2("E. Campus Pathway Updates (Dynamic Blockages & Real A* Rerouting)")
    p = doc.add_paragraph()
    p.add_run(
        "Campus pathways frequently close for campus events or repairs. Users can toggle real-world incidents:"
    )
    doc.add_paragraph("• EVENT IN PROGRESS — Canteen Forecourt ('An event is currently using this pathway. Find another walking route.')", style='List Bullet')
    doc.add_paragraph("• PATHWAY UNDER REPAIR — Admin East Promenade ('Maintenance work is in progress. This pathway is temporarily unavailable.')", style='List Bullet')
    
    add_callout(
        "Unlike basic demos that fake routes, CampusXplore actually disconnects the blocked edges from the graph. A* recalculates an alternative detour in real time. The 3D line, 2D map, and walking avatar instantly redirect through the remaining open paths!",
        bold_prefix="Real Algorithmic Rerouting: "
    )

    add_h2("F. Algorithm Execution Visualizer & Code Inspection")
    p = doc.add_paragraph()
    p.add_run(
        "An educational modal and step visualizer demonstrates how A* computes f(n) = g(n) + h(n), animating node evaluations step-by-step so anyone can understand the search mechanics."
    )

    # ==========================================
    # SECTION 5: PROJECT ARCHITECTURE & TECH STACK
    # ==========================================
    add_h1("5. Technology Stack & Modular Code Architecture")

    tech_table = doc.add_table(rows=7, cols=3)
    tech_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_headers = ["Layer / Domain", "Technology", "Role in Project"]
    for i, h in enumerate(t_headers):
        cell = tech_table.rows[0].cells[i]
        set_cell_background(cell, "1E3A8A")
        set_cell_margins(cell, top=100, bottom=100, left=80, right=80)
        p = cell.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        run = p.add_run(h)
        run.font.bold = True
        run.font.size = Pt(9.5)
        run.font.color.rgb = WHITE

    tech_data = [
        ("Core Frontend", "React 18 + TypeScript", "Component architecture, strict type safety, performant state management."),
        ("3D Graphics Engine", "Three.js & @react-three/fiber", "WebGL canvas, 3D geometries, materials, camera controls, lighting."),
        ("3D Helpers", "@react-three/drei", "OrbitControls, Html annotations, procedural scene helpers."),
        ("Styling & UI", "Tailwind CSS + Lucide Icons", "Glassmorphic dark UI, responsive sidebars, accessible navigation widgets."),
        ("Build Tool & Bundler", "Vite 5", "Lightning-fast hot module replacement (HMR) and optimized production bundling."),
        ("Testing Framework", "Node / tsx Test Runner", "Automated unit tests validating A* correctness, obstacle clearance, and presets.")
    ]

    for r_idx, r_vals in enumerate(tech_data):
        row = tech_table.rows[r_idx + 1]
        bg = "F8FAFC" if r_idx % 2 == 0 else "FFFFFF"
        for c_idx, val in enumerate(r_vals):
            cell = row.cells[c_idx]
            set_cell_background(cell, bg)
            set_cell_margins(cell, top=80, bottom=80, left=80, right=80)
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(val)
            r.font.size = Pt(9)
            if c_idx == 0:
                r.font.bold = True
                r.font.color.rgb = NAVY

    set_table_borders(tech_table, "CBD5E1")
    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    add_h2("Clean Modular Directory Structure")
    p = doc.add_paragraph()
    p.add_run("The codebase is organized cleanly for team collaboration and future extensions:")

    code_block = (
        "src/\n"
        "├── algorithms/         # Pure A* algorithm logic and CampusGraph data structures\n"
        "│   ├── astar/          # A* pathfinder, heuristic calculations, priority queue\n"
        "│   └── graph/          # Graph builder, edge blocking, waypoint distance checks\n"
        "├── components/\n"
        "│   ├── campus3d/       # 3D world: Campus3D, WalkingCharacter, Buildings, CameraController\n"
        "│   ├── campus2d/       # 2D topographic blueprint map view\n"
        "│   ├── navigation/     # Sidebar controls: LocationSelector, RouteButton, Pathway Updates\n"
        "│   ├── route/          # RouteStatus, RouteInfo HUD, and arrival alerts\n"
        "│   └── common/         # Minimal Header, branding, and modals\n"
        "├── data/               # Spatial JSON models: buildings, entrance nodes, paths, obstacles\n"
        "├── types/              # TypeScript definitions for graphs, routes, walker HUD, and alerts\n"
        "└── tests/              # Rigorous test suites for A*, graph clearance, and demo routes"
    )
    p_code = doc.add_paragraph()
    p_code.paragraph_format.left_indent = Inches(0.2)
    p_code.paragraph_format.space_after = Pt(8)
    r_c = p_code.add_run(code_block)
    r_c.font.name = 'Consolas'
    r_c.font.size = Pt(8.5)
    r_c.font.color.rgb = RGBColor(30, 41, 59)

    # ==========================================
    # SECTION 6: HOW TO RUN & VERIFY
    # ==========================================
    add_h1("6. How to Run, Test, and Verify the Project")

    p = doc.add_paragraph()
    p.add_run("Running the project takes less than 2 minutes on any computer with Node.js installed:")

    doc.add_paragraph("Step 1: Install Dependencies\nOpen terminal in the project folder and run:\n  npm install", style='List Number')
    doc.add_paragraph("Step 2: Start Development Server\nRun the Vite local development server:\n  npm run dev\nOpen http://localhost:5173/ in your browser.", style='List Number')
    doc.add_paragraph("Step 3: Run Algorithmic Unit Tests\nExecute the automated verification test suites:\n  npx tsx tests/algorithms/astar.test.ts\n  npx tsx tests/algorithms/graph.test.ts\n  npx tsx tests/navigation/routes.test.ts", style='List Number')
    doc.add_paragraph("Step 4: Build for Production\nVerify complete TypeScript compliance and bundling:\n  npm run build", style='List Number')

    # ==========================================
    # SECTION 7: HOW TO EXPLAIN THIS TO A FRIEND
    # ==========================================
    add_h1("7. How to Explain This Project to Your Friend")

    p = doc.add_paragraph()
    p.add_run(
        "Use this section as your cheat sheet when presenting CampusXplore to friends, classmates, professors, or interviewers."
    )

    add_h2("The 60-Second Elevator Pitch")
    add_callout(
        '"CampusXplore is a smart 3D college campus navigation app powered by the A* pathfinding algorithm. '
        'Instead of using generic street maps, it models the real pedestrian walkways and exact building entrance doors across campus. '
        'When you pick a start and destination, A* calculates the mathematically shortest walkable path avoiding all 17 campus buildings. '
        'You can watch an animated 3D person actually walk the path while tracking distance countdown and progress. '
        'Best of all, if a pathway is blocked by a college fest or maintenance, you can toggle an alert, and A* instantly recalculates an alternative detour around the closure in real time!"',
        bold_prefix="Say This: "
    )

    add_h2("Step-by-Step Live Demo Flow (Show This in 3 Minutes)")
    
    demo_steps = [
        ("1. Show the Clean UI & 3D Campus:", "Open the app at http://localhost:5173/. Show off the clean header 'CAMPUSXPLORE' and orbit around the 3D campus buildings, trees, and roads."),
        ("2. Calculate a Standard Route:", "Select Start: 'Main Gate' and Destination: 'Central Library'. Click 'FIND WALKABLE ROUTE'. Show the glowing 3D path line connecting the entrance waypoints."),
        ("3. Highlight the 3D Walking Avatar:", "Point out the character walking along the path. Show the live HUD counting up from 0% to 100% and distance decreasing to 0 meters, ending with the '✓ Arrived' alert."),
        ("4. Switch Camera to 'Follow Walker':", "Show how the camera smoothly tracks behind the walking character in 3rd-person view."),
        ("5. Demonstrate Real Dynamic Rerouting:", "Under 'CAMPUS PATHWAY UPDATES', check 'EVENT IN PROGRESS (Canteen Forecourt)'. Show how A* instantly detects the unavailable path, alerts the user, and computes an alternative detour route that the walker follows!")
    ]

    for title, desc in demo_steps:
        p = doc.add_paragraph(style='List Bullet')
        rt = p.add_run(title + " ")
        rt.font.bold = True
        rt.font.color.rgb = NAVY
        rd = p.add_run(desc)

    add_h2("Frequently Asked Questions (FAQ) & Smart Answers")

    faqs = [
        ("Q: Why didn't you just use Dijkstra's algorithm?",
         "A: Dijkstra calculates the shortest path, but it searches blindly in every radial direction like ripples in a pond. A* uses a Euclidean heuristic h(n) that pulls the search directly towards the destination entrance. This explores significantly fewer nodes, making it much faster while guaranteeing the same optimal shortest distance."),
        
        ("Q: Is the rerouting hardcoded / faked when an event occurs?",
         "A: Not at all! When you toggle 'EVENT IN PROGRESS', the underlying code literally calls graph.setEdgeBlocked() on those pathway edges. A* is executed with the updated graph and dynamically searches for an open alternative path. We even have unit tests in astar.test.ts that prove the detour uses alternative promenade nodes."),
        
        ("Q: How does the walker know where to step without hitting walls?",
         "A: The campus has a waypoint navigation graph where every node and edge is pre-verified to have safety clearance outside building bounding boxes. The walker follows the exact list of waypoint coordinates returned by A*, stepping along the verified walkway network."),
        
        ("Q: What happens if there is no possible route?",
         "A: If all pathways to a building are blocked, A* finishes exploring the graph, determines that the goal is unreachable, and gracefully displays a clear error: 'No walkable route could be found. Connecting paths may be blocked by temporary closures.'")
    ]

    for q, a in faqs:
        p_q = doc.add_paragraph()
        p_q.paragraph_format.space_before = Pt(6)
        p_q.paragraph_format.space_after = Pt(2)
        p_q.paragraph_format.keep_with_next = True
        rq = p_q.add_run(q)
        rq.font.bold = True
        rq.font.color.rgb = NAVY
        
        p_a = doc.add_paragraph()
        p_a.paragraph_format.space_after = Pt(6)
        ra = p_a.add_run(a)
        ra.font.color.rgb = SLATE_DARK

    # ==========================================
    # CONCLUSION / SUMMARY
    # ==========================================
    add_h1("8. Project Summary")
    p = doc.add_paragraph()
    p.add_run(
        "CampusXplore successfully bridges theoretical computer science (A* search, heuristics, graph theory) with modern interactive software engineering (3D graphics, real-time animation, reactive state management). "
        "It serves as a comprehensive, polished, and academically rigorous showcase of AI-powered navigation."
    )

    doc_path = os.path.abspath("CampusXplore_Project_Handoff_Document.docx")
    doc.save(doc_path)
    print(f"Document successfully created at: {doc_path}")

if __name__ == "__main__":
    create_document()
