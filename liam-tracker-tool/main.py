from rich.panel import Panel
from rich.text import Text
from rich.console import Console
from rich import box
from rich.prompt import Prompt

from dotenv import load_dotenv
import requests
import json
import os

import re

load_dotenv()
# --- URLs DE WEBHOOK ---
WEBHOOK_URL_CONSULTA = os.getenv("WEBHOOK_URL_CONSULTA")  # URL para Consultar (antes WEBHOOK_URL)
WEBHOOK_URL_CREAR = os.getenv("WEBHOOK_URL_CREAR")      # Nueva URL para Crear Ticket (debes definirla en .env)
# -----------------------

USER_ICON = "💬"
BOT_ICON = "🧠"

USER_COLOR = "blue"
BOT_COLOR = "green"

console = Console()

def print_setup():
    """Imprime el encabezado y la bienvenida."""
    
    # 1. Limpiamos la consola al inicio
    console.clear() 

    # Encabezado (Banda Azul)
    console.print(Panel(
    Text("L.IA.M TRACKER TOOL", justify="center", style="bold #FF00FF on #1E90FF"),
    box=box.DOUBLE, 
    style="#1E90FF"))
    
    # Bienvenida (Banda Verde)
    console.print(Panel(
        Text("Bienvenido! Seleccione una opción para comenzar.", justify="center"),
        border_style="green", 
        box=box.ROUNDED
    ))
    
    console.print() # Salto de línea final

def procesar_respuesta(response):
    # 1) Intentar decodificar JSON
    try:
        response_json = response.json()

        # Si tiene JSON válido
        if "output" in response_json:
            return response_json["output"]

        # Si el JSON no contiene “output”
        return json.dumps(response_json, indent=2, ensure_ascii=False)

    except json.JSONDecodeError:
        # 2) Respuesta NO es JSON → Texto plano
        if response.text.strip():
            return response.text.strip()

        # 3) Respuesta vacía
        return "! ERROR: Intenta con otra consulta."


def enviar_mensaje(mensaje: str, webhook_url: str):
    """Envía un mensaje al webhook."""

    data = {
        "chatInput": mensaje,
        "sessionId": "default_session",
        "mailDestino": buscar_gmail(mensaje)
    }

    headers = {'Content-Type': 'application/json'}

    try:
        # Usa la URL pasada como parámetro
        response = requests.post(webhook_url, json=data, headers=headers)
        response.raise_for_status()
        return procesar_respuesta(response)

    except requests.exceptions.RequestException as e:
        return f"Error al realizar la solicitud: {e}"

def buscar_gmail(texto: str) -> str:
    """Busca una dirección de correo @gmail.com o devuelve el mail por defecto."""
    regex = r'\b[a-zA-Z0-9._%+-]+@gmail\.com\b'
    match = re.search(regex, texto)
    
    if match:
        return match.group(0)
    else:
        return "s.soporte.tickets@gmail.com"


# ----------------------------------------------------------------------
# Lógica de los Submenús
# ----------------------------------------------------------------------

def consultar_tickets():
    """Bucle de interacción para CONSULTAR tickets."""
    
    console.print(Panel(
        Text("MODO: CONSULTA DE TICKETS. Escriba 'OPCIONES' para volver al menú.", justify="center"),
        border_style="yellow", 
        box=box.ROUNDED
    ))
    
    while True:
        try:
            user_msg = Prompt.ask(f"[bold {USER_COLOR}]{USER_ICON}  Tu consulta: [/bold {USER_COLOR}]")

            if user_msg.lower() in ("salir", "exit", "quit"):
                return "salir" # Indica que el programa debe terminar
            
            # 📌 NUEVA LÓGICA: Volver al menú
            if user_msg.upper() == "OPCIONES":
                console.print("\n" + "[bold magenta]Volviendo al menú principal...[/bold magenta]".ljust(console.width))
                return "menu" # Indica que debe volver al menú

            # 2. Procesar el mensaje y obtener respuesta usando la URL de CONSULTA
            respuesta = enviar_mensaje(user_msg, WEBHOOK_URL_CONSULTA)

            # 3. Imprimir la respuesta del bot
            console.print(f"{BOT_ICON}  [bold cyan]Liam[/bold cyan]: ", style=BOT_COLOR, end="")
            console.print(respuesta, style="white")
            
            console.print()

        except Exception as e:
            console.print(f"[bold red]Ocurrió un error en CONSULTA: {e}[/bold red]")
            return "menu" # Volver al menú en caso de error

def crear_ticket():
    """Bucle de interacción para CREAR tickets."""
    
    console.print(Panel(
        Text("MODO: CREACIÓN DE TICKETS. Escriba 'OPCIONES' para volver al menú.", justify="center"),
        border_style="yellow", 
        box=box.ROUNDED
    ))
    
    while True:
        try:
            # En la creación de tickets, esperamos una descripción o un comando de salida/opciones
            user_msg = Prompt.ask(f"[bold {USER_COLOR}]{USER_ICON}  Tu: [/bold {USER_COLOR}]")

            if user_msg.lower() in ("salir", "exit", "quit"):
                return "salir" # Indica que el programa debe terminar
            
            if user_msg.upper() == "OPCIONES":
                console.print("\n" + "[bold magenta]Volviendo al menú principal...[/bold magenta]".ljust(console.width))
                return "menu" # Indica que debe volver al menú

            # 2. Procesar el mensaje y obtener respuesta usando la URL de CREAR
            respuesta = enviar_mensaje(user_msg, WEBHOOK_URL_CREAR)

            # 3. Imprimir la respuesta del bot
            console.print(f"{BOT_ICON}  [bold cyan]Liam[/bold cyan]: ", style=BOT_COLOR, end="")
            console.print(respuesta, style="white")
            
            console.print()
            # Después de enviar la solicitud, generalmente volvemos al menú principal
            # o se le pide al usuario una nueva entrada, aquí volvemos al menú por simplicidad.
            # return "menu"

        except Exception as e:
            console.print(f"[bold red]Ocurrió un error en CREACIÓN: {e}[/bold red]")
            return "menu"


def menu_principal():
    """Muestra el menú principal y maneja la navegación."""
    
    while True:
        console.print(Panel(
            Text(
                "1. CONSULTAR TICKETS\n"
                "2. CREAR TICKETS\n"
                "3. SALIR", 
                justify="left", 
                style="bold white"
            ),
            title="Opciones Disponibles",
            border_style="cyan",
            box=box.DOUBLE
        ))
        
        opcion = Prompt.ask(f"[bold {USER_COLOR}]OPCIÓN[/bold {USER_COLOR}]", choices=["1", "2", "3"])
        
        console.clear()
        print_setup() # Reimprime el encabezado
        
        if opcion == "1":
            resultado = consultar_tickets()
        elif opcion == "2":
            resultado = crear_ticket()
        else: # opcion == "3"
            resultado = "salir"

        if resultado == "salir":
            console.print("\n" + "[bold red]Cerrando...[/bold red]".ljust(console.width))
            break
        elif resultado == "menu":
            # Si se retorna 'menu', el bucle del menú principal continúa
            continue


# ----------------------------------------------------------------------
# Ejecución Principal
# ----------------------------------------------------------------------

if __name__ == "__main__":
    try:
        # Aseguramos que las URLs estén cargadas antes de iniciar
        if not WEBHOOK_URL_CONSULTA or not WEBHOOK_URL_CREAR:
            console.print(Panel(
                Text("ERROR: Asegúrate de configurar WEBHOOK_URL_CONSULTA y WEBHOOK_URL_CREAR en tu archivo .env.", style="bold red"),
                box=box.DOUBLE, 
                border_style="red"
            ))
        else:
            print_setup()
            menu_principal()

    except KeyboardInterrupt:
        console.print("\n" + "[bold red]Cerrando por interrupción...[/bold red]".center(console.width))
    except Exception as e:
        console.print(f"[bold red]Ocurrió un error grave: {e}[/bold red]")
