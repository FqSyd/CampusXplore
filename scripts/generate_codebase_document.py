import os
import sys
import json
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

# Ordered list of sections and their relative file paths
SECTIONS = [
    {
        "title": "1. Project Build & Toolchain Configuration",
        "desc": "Configuration files governing TypeScript compiler, Vite bundler, Tailwind CSS design system, and deployment environments.",
        "files": [
            "package.json",
            "tsconfig.json",
            "tsconfig.app.json",
            "tsconfig.node.json",
            "vite.config.ts",
            "tailwind.config.js",
            "postcss.config.js",
            "index.html",
            "vercel.json"
        ]
    },
    {
        "title": "2. Application Root & Core Styling",
        "desc": "Application entry points, master App component, providers, and global CSS styling.",
        "files": [
            "src/main.tsx",
            "src/App.tsx",
            "src/app/App.tsx",
            "src/app/main.tsx",
            "src/index.css",
            "src/styles/globals.css"
        ]
    },
    {
        "title": "3. A* Pathfinding Algorithm & Graph Models",
        "desc": "Core pathfinding engine: Priority queue, Euclidean heuristics, node exploration stepping, cost evaluation (f=g+h), and adjacency graph representation.",
        "files": [
            "src/algorithms/astar/astar.ts",
            "src/algorithms/astar/astarSteps.ts",
            "src/algorithms/astar/astarTypes.ts",
            "src/algorithms/astar/heuristic.ts",
            "src/algorithms/astar/index.ts",
            "src/algorithms/graph/graph.ts",
            "src/algorithms/graph/graphBuilder.ts",
            "src/algorithms/graph/graphTypes.ts",
            "src/algorithms/graph/index.ts",
            "src/algorithms/astar.ts",
            "src/algorithms/graph.ts",
            "src/algorithms/heuristic.ts",
            "src/algorithms/index.ts"
        ]
    },
    {
        "title": "4. Campus Spatial Data, Obstacles & Waypoint Networks",
        "desc": "Geospatial node coordinates, physical building footprints, walkable pathways, dynamic maintenance obstacles, and demo route scenarios.",
        "files": [
            "src/data/campus/buildings.ts",
            "src/data/campus/nodes.ts",
            "src/data/campus/edges.ts",
            "src/data/campus/obstacles.ts",
            "src/data/campus/campusConfig.ts",
            "src/data/campus/pathways.ts",
            "src/data/campus/index.ts",
            "src/data/presets/demoRoutes.ts",
            "src/data/presets/index.ts",
            "src/data/buildings.json",
            "src/data/paths.json",
            "src/data/campus.json",
            "src/data/obstacles.json",
            "src/data/buildings.ts",
            "src/data/campus.ts",
            "src/data/campusUpdates.ts",
            "src/data/pathways.ts",
            "src/data/index.ts"
        ]
    },
    {
        "title": "5. Interactive 3D Campus Simulation Engine",
        "desc": "Three.js and React Three Fiber 3D scene architecture: procedurally rendered campus buildings, pathways, lighting, animated 3D walker, collision avoidance, and spatial camera controllers.",
        "files": [
            "src/components/campus3d/Campus3D.tsx",
            "src/components/campus3d/Building.tsx",
            "src/components/campus3d/Pathways.tsx",
            "src/components/campus3d/Obstacles.tsx",
            "src/components/campus3d/NavigationMarker.tsx",
            "src/components/campus3d/NavigationRoute.tsx",
            "src/components/campus3d/WalkingCharacter.tsx",
            "src/components/campus3d/StaticCharacters.tsx",
            "src/components/campus3d/CampusLabels.tsx",
            "src/components/campus3d/CameraController.tsx",
            "src/components/campus3d/CampusEnvironment.tsx",
            "src/components/campus3d/index.ts",
            "src/components/campus/Campus3D.tsx",
            "src/components/campus/index.ts",
            "src/components/walker/WalkingCharacter.tsx",
            "src/components/walker/index.ts"
        ]
    },
    {
        "title": "6. 2D Topographic Campus Map",
        "desc": "Scalable Vector Graphic (SVG) 2D overview map with interactive buildings, nodes, route paths, and dynamic obstacle hatching.",
        "files": [
            "src/components/campus2d/Campus2D.tsx",
            "src/components/campus2d/MapBuildings.tsx",
            "src/components/campus2d/MapNodes.tsx",
            "src/components/campus2d/MapPaths.tsx",
            "src/components/campus2d/MapRoute.tsx",
            "src/components/campus2d/index.ts",
            "src/components/map/Campus2D.tsx",
            "src/components/map/index.ts"
        ]
    },
    {
        "title": "7. Map Controls, Camera Toolbar & View Selection",
        "desc": "Consolidated central map toolbar, 3D/2D segmented switch, collapsible camera dropdown perspectives, and A* Analysis toggle.",
        "files": [
            "src/components/map/MapToolbar.tsx",
            "src/components/camera/CameraControls.tsx",
            "src/components/camera/index.ts"
        ]
    },
    {
        "title": "8. Campus Navigation Sidebar & Route Controls",
        "desc": "User interaction sidebar: Origin and destination selector, dynamic obstacle closures, preset demo routes, and search animation controls.",
        "files": [
            "src/components/navigation/NavigationPanel.tsx",
            "src/components/navigation/LocationSelector.tsx",
            "src/components/navigation/RouteButton.tsx",
            "src/components/navigation/PresetRoutes.tsx",
            "src/components/navigation/ObstacleControlPanel.tsx",
            "src/components/navigation/index.ts",
            "src/components/route/NavigationRoute.tsx",
            "src/components/route/RouteInfo.tsx",
            "src/components/route/RouteStatus.tsx",
            "src/components/route/index.ts",
            "src/components/layout/Header.tsx",
            "src/components/layout/index.ts",
            "src/components/common/Button.tsx",
            "src/components/common/Header.tsx",
            "src/components/common/Modal.tsx",
            "src/components/common/Panel.tsx",
            "src/components/common/index.ts",
            "src/components/ui/Button.tsx",
            "src/components/ui/CameraControls.tsx",
            "src/components/ui/Modal.tsx",
            "src/components/ui/Panel.tsx",
            "src/components/ui/index.ts",
            "src/components/index.ts"
        ]
    },
    {
        "title": "9. A* Algorithm Node Analysis & Visualization Components",
        "desc": "Dedicated right-side A* Node Analysis panel, mathematical f=g+h score breakdowns, predecessor tracking, Open Set candidate comparison, and step-by-step visualizers.",
        "files": [
            "src/components/algorithm/NodeAnalysisCard.tsx",
            "src/components/algorithm/AlgorithmVisualizer.tsx",
            "src/components/algorithm/AlgorithmCode.tsx",
            "src/components/algorithm/NodeInspector.tsx",
            "src/components/algorithm/ScoreDisplay.tsx",
            "src/components/algorithm/AlgorithmControls.tsx",
            "src/components/algorithm/index.ts"
        ]
    },
    {
        "title": "10. TypeScript Type Definitions, State & Utilities",
        "desc": "Strongly typed domain models, custom React hooks, geometry calculation, collision detection, and coordinate projections.",
        "files": [
            "src/types/campus.ts",
            "src/types/navigation.ts",
            "src/types/algorithm.ts",
            "src/types/index.ts",
            "src/hooks/useCampus.ts",
            "src/hooks/usePathfinding.ts",
            "src/hooks/index.ts",
            "src/services/navigationService.ts",
            "src/services/index.ts",
            "src/state/navigationStore.ts",
            "src/state/viewStore.ts",
            "src/state/index.ts",
            "src/utils/distance.ts",
            "src/utils/collision.ts",
            "src/utils/coordinates.ts",
            "src/utils/graph.ts",
            "src/utils/routeUtils.ts",
            "src/utils/index.ts"
        ]
    },
    {
        "title": "11. Verification & Automated Unit/Integration Test Suites",
        "desc": "End-to-end mathematical verification: A* path optimality, physical clearance collision checks, demo scenario route metrics, and responsive layout state preservation.",
        "files": [
            "tests/algorithms/astar.test.ts",
            "tests/algorithms/graph.test.ts",
            "tests/navigation/routes.test.ts",
            "tests/navigation/layout.test.ts"
        ]
    }
]

def get_file_language(filepath):
    ext = os.path.splitext(filepath)[1].lower()
    mapping = {
        '.ts': 'typescript',
        '.tsx': 'tsx',
        '.js': 'javascript',
        '.json': 'json',
        '.css': 'css',
        '.html': 'html',
        '.md': 'markdown'
    }
    return mapping.get(ext, 'text')

def generate_markdown(repo_root, output_path):
    print("Generating Complete Codebase Markdown document...")
    total_files = 0
    total_lines = 0

    with open(output_path, "w", encoding="utf-8") as out:
        # Document Header
        out.write("# CampusXplore — Complete Codebase Documentation\n\n")
        out.write("> **Project**: CampusXplore: Smart College Campus Navigation Using A* Algorithm  \n")
        out.write("> **Architecture**: React 18, TypeScript, Vite, Three.js (@react-three/fiber), Tailwind CSS  \n")
        out.write("> **Deployment**: Vercel Production (`https://campusxplore-zeta.vercel.app`)  \n")
        out.write("> **Repository**: `https://github.com/FqSyd/CampusXplore.git`  \n")
        out.write("> **Date**: November 2026  \n\n")
        out.write("---\n\n")

        # Table of Contents
        out.write("## Table of Contents\n\n")
        for i, sec in enumerate(SECTIONS, 1):
            anchor = sec["title"].lower().replace(".", "").replace(" ", "-").replace("&", "").replace("/", "").replace("---", "-").strip("-")
            out.write(f"- [{sec['title']}](#{anchor})\n")
            for f in sec["files"]:
                file_anchor = f.lower().replace("/", "").replace(".", "").replace("-", "").replace("_", "")
                out.write(f"  - [`{f}`](#{file_anchor})\n")
        out.write("\n---\n\n")

        # Architectural Summary
        out.write("## Architectural Overview\n\n")
        out.write("CampusXplore is built as an interactive 3D/2D digital twin of a university campus. ")
        out.write("It demonstrates real-world application of the **A* (A-Star) Pathfinding Algorithm** with:\n\n")
        out.write("1. **Heuristic Evaluation**: $f(n) = g(n) + h(n)$ balancing accumulated path cost ($g$) with Euclidean distance ($h$).\n")
        out.write("2. **Walkable Navigation Graph**: 55+ bidirectional path edges and 36 waypoints designed with 100% collision clearance around physical campus buildings.\n")
        out.write("3. **Dynamic Re-routing**: Simulated campus maintenance and construction barricades trigger instantaneous recalculation of alternative detours.\n")
        out.write("4. **3D Walking Character**: Interactive animated student model that traverses the calculated A* route with smooth heading interpolation and speed tracking.\n")
        out.write("5. **Clean 3-Section Layout**: Left navigation sidebar, dynamic central 3D/2D map with compact toolbar, and dedicated right-side A* Node Analysis panel.\n\n")

        out.write("```mermaid\ngraph LR\n")
        out.write("    A[User Location Selection] --> B[CampusGraph & A* Solver]\n")
        out.write("    B --> C[Optimal Route & Step Analysis]\n")
        out.write("    C --> D[Central 3D/2D Map Engine]\n")
        out.write("    C --> E[Right A* Node Analysis Panel]\n")
        out.write("    D --> F[3D Walking Character Animation]\n")
        out.write("```\n\n")
        out.write("---\n\n")

        # Sections and Files
        for sec in SECTIONS:
            anchor_name = sec["title"]
            out.write(f"## {anchor_name}\n\n")
            out.write(f"*{sec['desc']}*\n\n")

            for rel_path in sec["files"]:
                full_path = os.path.join(repo_root, rel_path.replace("/", os.sep))
                if not os.path.exists(full_path):
                    print(f"Warning: File not found: {rel_path}")
                    continue

                with open(full_path, "r", encoding="utf-8", errors="ignore") as fp:
                    content = fp.read()

                lines = content.splitlines()
                line_count = len(lines)
                size_bytes = len(content.encode("utf-8"))
                lang = get_file_language(rel_path)
                total_files += 1
                total_lines += line_count

                file_anchor = rel_path.lower().replace("/", "").replace(".", "").replace("-", "").replace("_", "")
                out.write(f"<a id=\"{file_anchor}\"></a>\n")
                out.write(f"### File: `{rel_path}`\n\n")
                out.write(f"- **Path**: `file:///{full_path.replace(os.sep, '/')}`\n")
                out.write(f"- **Lines**: {line_count} | **Size**: {size_bytes:,} bytes | **Language**: `{lang}`\n\n")
                out.write(f"```{lang}\n")
                out.write(content)
                if not content.endswith("\n"):
                    out.write("\n")
                out.write("```\n\n")
                out.write("---\n\n")

    print(f"Markdown generated successfully: {output_path}")
    print(f"Total files compiled: {total_files}, Total lines: {total_lines:,}")
    return total_files, total_lines

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=140, right=140):
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

def generate_docx(repo_root, output_path, total_files, total_lines):
    print("Generating Word (.docx) Codebase document...")
    doc = Document()

    # Set margins
    for sec in doc.sections:
        sec.top_margin = Inches(0.8)
        sec.bottom_margin = Inches(0.8)
        sec.left_margin = Inches(0.8)
        sec.right_margin = Inches(0.8)

    # Styles & Fonts
    # Normal Style
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Calibri'
    normal_style.font.size = Pt(10)
    normal_style.font.color.rgb = RGBColor(0x33, 0x41, 0x55)

    # Cover Page
    title_p = doc.add_paragraph()
    title_p.paragraph_format.space_before = Pt(36)
    title_p.paragraph_format.space_after = Pt(8)
    run_title = title_p.add_run("CampusXplore")
    run_title.font.name = 'Arial'
    run_title.font.size = Pt(32)
    run_title.font.bold = True
    run_title.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)

    sub_p = doc.add_paragraph()
    sub_p.paragraph_format.space_after = Pt(24)
    run_sub = sub_p.add_run("Complete Codebase Compilation & Architecture Specification")
    run_sub.font.name = 'Arial'
    run_sub.font.size = Pt(16)
    run_sub.font.color.rgb = RGBColor(0x25, 0x63, 0xEB)

    meta_table = doc.add_table(rows=6, cols=2)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_table.autofit = False

    metadata = [
        ("Project Title", "Smart Campus Navigation Using A* Algorithm (CampusXplore)"),
        ("Technology Stack", "React 18 • TypeScript • Vite • Three.js (R3F) • Tailwind CSS"),
        ("Production URL", "https://campusxplore-zeta.vercel.app"),
        ("Repository", "https://github.com/FqSyd/CampusXplore.git"),
        ("Codebase Metrics", f"{total_files} source files • {total_lines:,} total lines of code"),
        ("Date / Version", "November 2026 • Production Release")
    ]

    for i, (label, val) in enumerate(metadata):
        cell_lbl = meta_table.cell(i, 0)
        cell_val = meta_table.cell(i, 1)
        cell_lbl.width = Inches(2.0)
        cell_val.width = Inches(4.8)
        set_cell_background(cell_lbl, "F1F5F9")
        set_cell_background(cell_val, "FFFFFF")
        set_cell_margins(cell_lbl, top=80, bottom=80, left=100, right=100)
        set_cell_margins(cell_val, top=80, bottom=80, left=100, right=100)
        
        p_lbl = cell_lbl.paragraphs[0]
        r_lbl = p_lbl.add_run(label)
        r_lbl.font.bold = True
        r_lbl.font.size = Pt(9.5)
        r_lbl.font.color.rgb = RGBColor(0x1E, 0x29, 0x3B)

        p_val = cell_val.paragraphs[0]
        r_val = p_val.add_run(val)
        r_val.font.size = Pt(9.5)
        r_val.font.color.rgb = RGBColor(0x33, 0x41, 0x55)

    doc.add_page_break()

    # Executive Overview
    h1 = doc.add_paragraph()
    r = h1.add_run("Executive Architecture Summary")
    r.font.name = 'Arial'
    r.font.size = Pt(18)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0x0F, 0x17, 0x2A)

    doc.add_paragraph(
        "CampusXplore is an advanced 3D geospatial campus navigation system powered by the A* (A-Star) search algorithm. "
        "The project integrates an optimal pathfinding graph with real-time obstacle avoidance, animated walking simulation, "
        "a 2D topographic overview, and live step-by-step mathematical cost analysis f(n) = g(n) + h(n)."
    )

    doc.add_paragraph(
        "This document contains the complete source code for all modules, data models, 3D rendering engines, "
        "mathematical heuristics, UI controls, and automated verification suites."
    )

    # Process Sections
    for sec in SECTIONS:
        doc.add_page_break()
        sec_p = doc.add_paragraph()
        sec_p.paragraph_format.space_before = Pt(14)
        sec_p.paragraph_format.space_after = Pt(4)
        run_sec = sec_p.add_run(sec["title"])
        run_sec.font.name = 'Arial'
        run_sec.font.size = Pt(15)
        run_sec.font.bold = True
        run_sec.font.color.rgb = RGBColor(0x1E, 0x3A, 0x8A)

        desc_p = doc.add_paragraph()
        desc_p.paragraph_format.space_after = Pt(10)
        r_desc = desc_p.add_run(sec["desc"])
        r_desc.font.italic = True
        r_desc.font.size = Pt(10)
        r_desc.font.color.rgb = RGBColor(0x64, 0x74, 0x8B)

        for rel_path in sec["files"]:
            full_path = os.path.join(repo_root, rel_path.replace("/", os.sep))
            if not os.path.exists(full_path):
                continue

            with open(full_path, "r", encoding="utf-8", errors="ignore") as fp:
                content = fp.read()

            lines = content.splitlines()
            line_count = len(lines)
            size_kb = len(content.encode("utf-8")) / 1024

            # File Header Box
            f_table = doc.add_table(rows=1, cols=1)
            f_table.alignment = WD_TABLE_ALIGNMENT.CENTER
            f_cell = f_table.cell(0, 0)
            f_cell.width = Inches(6.8)
            set_cell_background(f_cell, "0F172A")
            set_cell_margins(f_cell, top=80, bottom=80, left=120, right=120)

            fp_p = f_cell.paragraphs[0]
            fp_p.paragraph_format.space_before = Pt(0)
            fp_p.paragraph_format.space_after = Pt(0)
            r_fname = fp_p.add_run(f"FILE: {rel_path}")
            r_fname.font.name = 'Courier New'
            r_fname.font.bold = True
            r_fname.font.size = Pt(10)
            r_fname.font.color.rgb = RGBColor(0x38, 0xBD, 0xF8) # Cyan

            r_fmeta = fp_p.add_run(f"  ({line_count} lines • {size_kb:.1f} KB)")
            r_fmeta.font.name = 'Calibri'
            r_fmeta.font.size = Pt(9)
            r_fmeta.font.color.rgb = RGBColor(0x94, 0xA3, 0xB8)

            # Code Box
            c_table = doc.add_table(rows=1, cols=1)
            c_table.alignment = WD_TABLE_ALIGNMENT.CENTER
            c_cell = c_table.cell(0, 0)
            c_cell.width = Inches(6.8)
            set_cell_background(c_cell, "F8FAFC")
            set_cell_margins(c_cell, top=100, bottom=100, left=120, right=120)

            # Render code in lines
            cp = c_cell.paragraphs[0]
            cp.paragraph_format.space_before = Pt(0)
            cp.paragraph_format.space_after = Pt(0)
            cp.paragraph_format.line_spacing = 1.05

            # To keep file generation fast while preserving complete code:
            code_run = cp.add_run(content)
            code_run.font.name = 'Courier New'
            code_run.font.size = Pt(7.5)
            code_run.font.color.rgb = RGBColor(0x1E, 0x29, 0x3B)

            doc.add_paragraph().paragraph_format.space_after = Pt(8)

    doc.save(output_path)
    print(f"Word document generated successfully: {output_path}")

if __name__ == "__main__":
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    docs_dir = os.path.join(repo_root, "docs")
    os.makedirs(docs_dir, exist_ok=True)

    md_output = os.path.join(docs_dir, "CampusXplore_Complete_Codebase.md")
    docx_output = os.path.join(docs_dir, "CampusXplore_Complete_Codebase.docx")

    total_files, total_lines = generate_markdown(repo_root, md_output)
    generate_docx(repo_root, docx_output, total_files, total_lines)
