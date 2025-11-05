# Proyecto Final: Consultas IA para Tickets de Soporte

Este repositorio contiene el desarrollo del Proyecto Final "Consultas inteligentes con IA sobre una base de datos empresarial" , realizado para el **Centro Pescar ARTECH 2025**.

El proyecto se enfoca en **Seguimiento de Tickets de Soporte**. El objetivo es un sistema que permite a un usuario realizar consultas en lenguaje natural a una base de datos de tickets de soporte técnico, utilizando una consola de Python, un flujo de n8n y el modelo de IA Gemini.

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![n8n](https://img.shields.io/badge/n8n-1A1A1A?style=for-the-badge&logo=n8n&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini-8E4BFF?style=for-the-badge&logo=google&logoColor=white)
![SQL](https://img.shields.io/badge/SQL-005C84?style=for-the-badge&logo=postgresql&logoColor=white)

---

## 🚀 Descripción del Problema

Una empresa que brinda servicios de telefonía y cable necesita un sistema inteligente para que gerentes o supervisores puedan consultar el estado de los reclamos de los clientes (tickets). El sistema debe ser capaz de entender peticiones complejas en lenguaje natural y generar reportes automáticamente.

## 🛠️ Arquitectura y Stack Tecnológico

La solución implementa un flujo de datos que desacopla la lógica del negocio de la consulta de datos, orquestado por n8n.

![Arquitectura del proyecto n8n](https://i.postimg.cc/wvnTgsdY/Screenshot-2025-11-05-100112.png)

**El flujo es el siguiente:**
1.  **Usuario Final:** Escribe una petición en lenguaje natural en una consola de Python (Ej: "Cuántos tickets abiertos tiene el técnico Juan Pérez?").
2.  **Python:** Envía esta petición a un Webhook de n8n vía HTTP REST.
3.  **n8n:** Recibe la petición y utiliza el nodo de **Gemini** (AI Agent) para interpretar la solicitud.
4.  **IA (Gemini):** Analiza la petición y la transforma en una consulta SQL dinámica y estructurada.
5.  **n8n:** Ejecuta la consulta SQL en la base de datos (Supabase).
6.  **Base de Datos:** Devuelve los datos a n8n.
7.  **n8n:** Procesa la respuesta y ejecuta la acción solicitada por el usuario:
    * Devolver una respuesta simple a la consola.
    * Generar un archivo **Excel/CSV**.
    * Enviar un reporte por **Email**.
    * Guardar el archivo en **Google Drive**.

### Tecnologías Utilizadas
* **Base de Datos:** Supabase (PostgreSQL)
* **Orquestación y API:** n8n 
* **Modelo de IA:** Gemini 
* **Interfaz de Usuario:** Consola de Python 

---

## 📋 Base de Datos (Tema 5)

La base de datos fue diseñada para gestionar el ciclo de vida de los tickets de soporte:

![Base](https://i.postimg.cc/J0HKgSRq/Whats-App-Image-2025-11-02-at-22-02-29-a8bad39b.jpg)

---

## ✨ Ejemplos de Consultas Soportadas

El sistema es capaz de interpretar una variedad de solicitudes en lenguaje natural, como:

> `Mostrame el historial del ticket 4570 y los datos del cliente.`
> `Enviar por mail a xxx@yyy.com un listado de tickets pendientes del servicio telefonía fija con prioridad alta, incluyendo información del cliente solicitante y de las propiedades del ticket.`

> `Generá un Excel con todos los clientes de la empresa y la cantidad de reclamos realizados por cada uno en el año actual.` 

> `Guardar en Google Drive una planilla con la base de conocimientos de cada servicio.`
---

## 👥 Integrantes del Equipo  
<table>
  <tr>
    <th>👤 Nombre</th>
    <th>🌐 GitHub</th>
    <th>💼 LinkedIn</th>
  </tr>
  <tr>
    <td align="center"><b>Florencia Mora</b></td>
    <td align="center"><a href="https://github.com/"><img src="https://img.shields.io/badge/GitHub-100000?style=flat&logo=github&logoColor=white"/></a></td>
    <td align="center"><a href="https://linkedin.com/"><img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=flat&logo=linkedin&logoColor=white"/></a></td>
  </tr>
  <tr>
    <td align="center"><b>Maximiliano Encinas</b></td>
    <td align="center"><a href="https://github.com/"><img src="https://img.shields.io/badge/GitHub-100000?style=flat&logo=github&logoColor=white"/></a></td>
    <td align="center"><a href="https://linkedin.com/"><img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=flat&logo=linkedin&logoColor=white"/></a></td>
  </tr>
    <td align="center"><b>Maria Monchot</b></td>
    <td align="center"><a href="https://github.com/"><img src="https://img.shields.io/badge/GitHub-100000?style=flat&logo=github&logoColor=white"/></a></td>
    <td align="center"><a href="https://linkedin.com/"><img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=flat&logo=linkedin&logoColor=white"/></a></td>
  </tr>
  <tr>
    <td align="center"><b>Denise Gimenez</b></td>
    <td align="center"><a href="https://github.com/"><img src="https://img.shields.io/badge/GitHub-100000?style=flat&logo=github&logoColor=white"/></a></td>
    <td align="center"><a href="https://linkedin.com/"><img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=flat&logo=linkedin&logoColor=white"/></a></td>
  </tr>
  <tr>
    <td align="center"><b>Saúl Padilla</b></td>
    <td align="center"><a href="https://github.com/"><img src="https://img.shields.io/badge/GitHub-100000?style=flat&logo=github&logoColor=white"/></a></td>
    <td align="center"><a href="https://linkedin.com/"><img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=flat&logo=linkedin&logoColor=white"/></a></td>
  </tr>
  <tr>
</table>
