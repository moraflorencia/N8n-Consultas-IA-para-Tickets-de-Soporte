#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
LIAM TRACKER TOOL - Framework CLI estilo Metasploit/Seeker
Versión: 2.0
Autor: ChatGPT x Saul
"""

from rich.console import Console
from rich.panel import Panel
from rich.prompt import Prompt
from rich.table import Table
from rich.text import Text
from rich import box
from rich.progress import Progress, SpinnerColumn, TextColumn

from dotenv import load_dotenv
import os
import requests
import json
import re
import time


# ---------------------------------------------------------
# CONFIGURACIÓN INICIAL
# ---------------------------------------------------------
console = Console()
load_dotenv()

WEBHOOK_URL_CONSULTA = os.getenv("WEBHOOK_URL_CONSULTA")
WEBHOOK_URL_CREAR    = os.getenv("WEBHOOK_URL_CREAR")

USER_ICON = "💬"
BOT_ICON = "🧠"
CYBER = "#00E5FF"


# ---------------------------------------------------------
# UI – APARIENCIA ESTILO HACKING
# ---------------------------------------------------------
def header():
    console.clear()
    banner = Text("""
██╗     ██╗ █████╗ ███╗   ███╗    ████████╗██████╗  █████╗  ██████╗██╗  ██╗███████╗██████╗ 
██║     ██║██╔══██╗████╗ ████║    ╚══██╔══╝██╔══██╗██╔══██╗██╔════╝██║ ██╔╝██╔════╝██╔══██╗
██║     ██║███████║██╔████╔██║       ██║   ██████╔╝███████║██║     █████╔╝ █████╗  ██████╔╝
██║     ██║██╔══██║██║╚██╔╝██║       ██║   ██╔══██╗██╔══██║██║     ██╔═██╗ ██╔══╝  ██╔══██╗
███████╗██║██║  ██║██║ ╚═╝ ██║       ██║   ██║  ██║██║  ██║╚██████╗██║  ██╗███████╗██║  ██║
╚══════╝╚═╝╚═╝  ╚═╝╚═╝     ╚═╝       ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝
""", style=f"bold {CYBER}")
    
    console.print(Panel(banner, box=box.DOUBLE, border_style=CYBER))
    console.print(Panel("🚀 Framework CLI para Tickets via Webhook · Modo Ciberpunk",
                        style="bold magenta", box=box.ROUNDED))


def loading(text="Procesando..."):
    with Progress(
        SpinnerColumn(style="cyan"),
        TextColumn("[cyan]{task.description}"),
        transient=True
    ) as progress:
        progress.add_task(text, total=None)
        time.sleep(0.8)


# ---------------------------------------------------------
# AUXILIARES
# ---------------------------------------------------------
def buscar_gmail(texto: str) -> str:
    regex = r'\b[a-zA-Z0-9._%+-]+@gmail\.com\b'
    match = re.search(regex, texto)
    return match.group(0) if match else "s.soporte.tickets@gmail.com"


def procesar_respuesta(response):
    """Mejor decodificador de JSON, sin romperse nunca."""
    try:
        data = response.json()
        return data.get("output") or json.dumps(data, indent=2, ensure_ascii=False)
    except:
        return response.text.strip() if response.text else "⚠️ Respuesta vacía o inválida."


def enviar(webhook, mensaje):
    data = {
        "chatInput": mensaje,
        "sessionId": "default_session",
        "mailDestino": buscar_gmail(mensaje)
    }

    try:
        loading("Enviando al servidor...")
        r = requests.post(webhook, json=data, headers={"Content-Type": "application/json"})
        r.raise_for_status()
        return procesar_respuesta(r)
    except Exception as e:
        return f"[red]Error de conexión:[/red] {e}"


# ---------------------------------------------------------
# MODOS
# ---------------------------------------------------------
def modo_consulta():
    console.print(Panel("🔎 MODO CONSULTA · Escriba 'menu' para volver",
                        border_style="yellow", box=box.ROUNDED))
    
    while True:
        msg = Prompt.ask(f"[{CYBER}]{USER_ICON} Consulta")
        
        if msg.lower() in ("menu", "volver"):
            return
        if msg.lower() in ("exit", "salir"):
            exit()

        resp = enviar(WEBHOOK_URL_CONSULTA, msg)

        console.print(f"\n{BOT_ICON} [bold cyan]Liam:[/bold cyan] {resp}\n")


def modo_creacion():
    console.print(Panel("📝 MODO CREACIÓN · Escriba 'menu' para volver",
                        border_style="green", box=box.ROUNDED))
    
    while True:
        msg = Prompt.ask(f"[{CYBER}]{USER_ICON} Descripción")

        if msg.lower() in ("menu", "volver"):
            return
        if msg.lower() in ("exit", "salir"):
            exit()

        resp = enviar(WEBHOOK_URL_CREAR, msg)

        console.print(f"\n{BOT_ICON} [bold cyan]Liam:[/bold cyan] {resp}\n")


# ---------------------------------------------------------
# MENÚ PRINCIPAL ESTILO METASPLOIT
# ---------------------------------------------------------
def menu():
    while True:
        table = Table(title="L.I.A.M COMMAND CENTER", box=box.SQUARE, border_style=CYBER)
        table.add_column("ID", justify="center", style=CYBER, width=5)
        table.add_column("Acción", style="white")

        table.add_row("1", "Consultar Tickets")
        table.add_row("2", "Crear Ticket")
        table.add_row("3", "Salir")

        console.print(table)

        opcion = Prompt.ask("[bold magenta]Seleccione[/bold magenta]", choices=["1", "2", "3"])

        if opcion == "1":
            modo_consulta()
        elif opcion == "2":
            modo_creacion()
        else:
            console.print("[red]Cerrando herramienta...[/red]")
            exit()


# ---------------------------------------------------------
# MAIN
# ---------------------------------------------------------
if __name__ == "__main__":
    try:
        if not WEBHOOK_URL_CONSULTA or not WEBHOOK_URL_CREAR:
            console.print("[red]ERROR: Falta configurar las URLs en el .env[/red]")
            exit()

        header()
        menu()

    except KeyboardInterrupt:
        console.print("\n[red]Interrupción manual. Cerrando...[/red]")
    except Exception as e:
        console.print(f"[bold red]ERROR FATAL:[/bold red] {e}")
