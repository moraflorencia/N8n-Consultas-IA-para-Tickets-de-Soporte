
-----

## 🧠 L.IA.M TRACKER TOOL: Cliente de Terminal para Gestión de Tickets

Este proyecto es una aplicación de línea de comandos (CLI) interactiva diseñada para interactuar con servicios de backend (Webhooks de n8n) para gestionar tickets. Permite a los usuarios **consultar** y **crear** tickets a través de una interfaz de terminal simple y amigable, delegando toda la lógica de negocio y procesamiento de datos a los flujos de trabajo de backend.

-----

## 🛠️ Instalación y Requisitos

Asegúrate de tener instalado **Python 3.8 o superior**.

### 1\. Clonar el Repositorio

Descarga el código fuente a tu máquina local:

```bash
git clone https://github.com/moraflorencia/N8n-Consultas-IA-para-Tickets-de-Soporte.git
cd liam-tracker-tool
```

### 2\. Instalación de Librerías

Todas las librerías necesarias (incluyendo `rich` para la interfaz y `requests` para las peticiones HTTP) están listadas en el archivo `requirements.txt`. Instálalas utilizando `pip`:

```bash
pip install -r requirements.txt
```

-----

## ⚙️ Configuración del Entorno (`.env`)

La herramienta requiere la configuración de dos *webhooks* distintos para separar las funcionalidades de consulta y creación.

### 1\. Creación del Archivo `.env`

En la **raíz del proyecto**, crea un archivo llamado **`.env`** y añade las siguientes URLs:

```
# 🔗 URL del Webhook para la funcionalidad de CONSULTA de tickets (lectura de datos).
WEBHOOK_URL_CONSULTA="https://tudominio.com/webhook/consulta_tickets"

# 🔗 URL del Webhook para la funcionalidad de CREACIÓN de tickets (escritura/inserción de nuevos datos).
WEBHOOK_URL_CREAR="https://tudominio.com/webhook/crear_nuevo_ticket"
```

> **Importante:** La aplicación verificará que ambas URLs existan antes de iniciar el menú principal.

### 2\. Estructura de Datos Enviada a los Webhooks

Independientemente del modo (Consulta o Creación), la aplicación envía una solicitud `POST` con la siguiente estructura JSON:

| Campo | Descripción |
| :--- | :--- |
| `chatInput` | El mensaje o la consulta ingresada por el usuario en la terminal. |
| `sessionId` | Identificador de la sesión (fijo en `default_session`). |
| `mailDestino` | Dirección de correo electrónico **`@gmail.com`** extraída del `chatInput` (si se encuentra), o la dirección por defecto (`s.soporte.tickets@gmail.com`). |

El flujo de trabajo de backend (por ejemplo, en n8n) debe recibir esta data y responder con un texto plano o un JSON que contenga la clave **`"output"`** para que la respuesta se muestre correctamente en la terminal.

-----

## 🚀 Uso de la Aplicación

Ejecuta el script principal de Python:

```bash
python main.py
```

  * **Navegación:** Al iniciar, serás guiado por un menú para seleccionar **Consultar Tickets** o **Crear Tickets**.
  * **Volver al Menú:** En cualquier modo de interacción, escribe **`OPCIONES`** para volver al menú principal.
  * **Salir:** Escribe **`SALIR`** (o `exit`/`quit`) para finalizar el programa.

<!-- end list -->

```
```