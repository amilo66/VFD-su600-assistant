// Base de datos completa con los parámetros reales del SUSWE SU-600
const listaParametrosCompleta = [
    // ==========================================
    // GRUPO P00: PARÁMETROS BÁSICOS
    // ==========================================
    {
        "codigo": "P00.01",
        "nombre": "Control mode selection (Modo de control)",
        "defecto": "2",
        "rango": "0: V/F control; 1: Sensorless vector control 1 (SVC 1); 2: Sensorless vector control 2 (SVC 2)",
        "tu_valor": "0",
        "notas": "Modo V/F para configuraciones estándar.",
        "pagina_pdf": 14
    },
{
    "codigo": "P00.02",
    "nombre": "Command source selection (Fuente de comando marcha/paro)",
    "defecto": "0",
    "rango": "0: Keypad control (Panel); 1: Terminal control (Bornes externos); 2: Communication control (RS485 Modbus)",
    "tu_valor": "1",
    "notas": "Poner en 1 si usas interruptor externo cableado.",
    "pagina_pdf": 14
},
{
    "codigo": "P00.03",
    "nombre": "Main frequency source A selection (Fuente de frecuencia principal A)",
    "defecto": "0",
    "rango": "0: Digital setting; 1: AI1; 2: AI2; 3: Panel potentiometer (Potenciómetro frontal); 4: High-speed pulse; 5: Multi-speed; 6: Simple PLC; 7: PID; 8: Communication",
    "tu_valor": "3",
    "notas": "Poner en 3 para usar la ruleta física del frontal.",
    "pagina_pdf": 14
},
{
    "codigo": "P00.04",
    "nombre": "Max output frequency (Frecuencia máxima de salida)",
    "defecto": "50.00 Hz",
    "rango": "50.00 Hz - 600.00 Hz",
    "tu_valor": "50.00 Hz",
    "notas": "Establece el tope absoluto de Hz que el equipo enviará al motor.",
    "pagina_pdf": 14
},
{
    "codigo": "P00.06",
    "nombre": "Frequency upper limit (Límite superior de frecuencia)",
    "defecto": "50.00 Hz",
    "rango": "Límite inferior (P00.07) - Frecuencia máxima (P00.04)",
    "tu_valor": "50.00 Hz",
    "notas": "Tope máximo de consigna para el operador.",
    "pagina_pdf": 14
},
{
    "codigo": "P00.07",
    "nombre": "Frequency lower limit (Límite inferior de frecuencia)",
    "defecto": "0.00 Hz",
    "rango": "0.00 Hz - Límite superior (P00.06)",
    "tu_valor": "0.00 Hz",
    "notas": "Frecuencia mínima de trabajo.",
    "pagina_pdf": 14
},
{
    "codigo": "P00.09",
    "nombre": "Source of frequency upper limit (Fuente del límite superior)",
    "defecto": "0",
    "rango": "0: P00.06 setting; 1: AI1; 2: AI2; 3: Potentiometer; 4: High-speed pulse; 5: Communication",
    "tu_valor": "0",
    "notas": "Fija el límite superior según el valor introducido en P00.06.",
    "pagina_pdf": 14
},
{
    "codigo": "P00.11",
    "nombre": "Acceleration time 1 (Tiempo de aceleración 1)",
    "defecto": "Dep. modelo",
    "rango": "0.0s - 6500.0s",
    "tu_valor": "10.0s",
    "notas": "Tiempo para acelerar desde 0Hz hasta la frecuencia máxima.",
    "pagina_pdf": 14
},
{
    "codigo": "P00.12",
    "nombre": "Deceleration time 1 (Tiempo de deceleración 1)",
    "defecto": "Dep. modelo",
    "rango": "0.0s - 6500.0s",
    "tu_valor": "10.0s",
    "notas": "Tiempo para frenar desde la frecuencia máxima hasta 0Hz.",
    "pagina_pdf": 15
},
{
    "codigo": "P00.13",
    "nombre": "Rotation direction selection (Dirección de rotación / Giro)",
    "defecto": "0",
    "rango": "0: Same direction; 1: Reverse direction; 2: Forbid reverse running (Prohibir marcha atrás)",
    "tu_valor": "0",
    "notas": "Cambiar a 1 si el motor gira al revés sin cambiar los cables de fase.",
    "pagina_pdf": 15
},
{
    "codigo": "P00.14",
    "nombre": "Carrier frequency setting (Frecuencia portadora)",
    "defecto": "Dep. modelo",
    "rango": "2.0 kHz - 20.0 kHz",
    "tu_valor": "8.0 kHz",
    "notas": "Ajusta el ruido de conmutación del motor (choque magnético).",
    "pagina_pdf": 15
},
{
    "codigo": "P00.18",
    "nombre": "Parameter initialization / Reset (Inicialización / Restablecer fábrica)",
    "defecto": "0",
    "rango": "0: No action; 1: Restore factory defaults (excluyendo motor); 2: Clear fault records",
    "tu_valor": "0",
    "notas": "¡Cuidado! Poner en 1 borra la configuración y vuelve a los valores de fábrica.",
    "pagina_pdf": 15
},

// ==========================================
// GRUPO P02: PARÁMETROS DEL MOTOR
// ==========================================
{
    "codigo": "P02.01",
    "nombre": "Motor rated power (Potencia nominal del motor)",
    "defecto": "Dep. modelo",
    "rango": "0.1 kW - 1000.0 kW",
    "tu_valor": "1.5 kW",
    "notas": "Ajustar según la placa de características de tu motor.",
    "pagina_pdf": 16
},
{
    "codigo": "P02.02",
    "nombre": "Motor rated frequency (Frecuencia nominal del motor)",
    "defecto": "50.00 Hz",
    "rango": "50.00 Hz - 600.00 Hz",
    "tu_valor": "50.00 Hz",
    "notas": "Frecuencia base del motor (habitualmente 50Hz en Europa).",
    "pagina_pdf": 16
},
{
    "codigo": "P02.03",
    "nombre": "Motor rated speed (Velocidad nominal en RPM)",
    "defecto": "1440 rpm",
    "rango": "1 rpm - 36000 rpm",
    "tu_valor": "1420 rpm",
    "notas": "Revoluciones reales del motor cargadas en placa.",
    "pagina_pdf": 16
},
{
    "codigo": "P02.04",
    "nombre": "Motor rated voltage (Voltaje nominal del motor)",
    "defecto": "380 V",
    "rango": "0 V - 460 V",
    "tu_valor": "230 V",
    "notas": "Cambiar a 220V/230V si tu red o conexión en bornes es trifásica de bajo voltaje.",
    "pagina_pdf": 16
},
{
    "codigo": "P02.05",
    "nombre": "Motor rated current (Corriente nominal / Amperios)",
    "defecto": "Dep. modelo",
    "rango": "0.1 A - 2000.0 A",
    "tu_valor": "5.8 A",
    "notas": "Crucial para la protección térmica interna del variador.",
    "pagina_pdf": 16
},

// ==========================================
// GRUPO P04: CONTROL V/F (VOLTAJE/FRECUENCIA)
// ==========================================
{
    "codigo": "P04.01",
    "nombre": "V/F curve setting (Configuración de la curva V/F)",
    "defecto": "0",
    "rango": "0: Linear torque; 1: Multi-point V/F curve; 2: Square torque curve; 3: 1.2 times torque; 4: 1.7 times torque",
    "tu_valor": "0",
    "notas": "0 es la óptima para aplicaciones industriales de par constante.",
    "pagina_pdf": 18
},
{
    "codigo": "P04.02",
    "nombre": "Torque boost (Elevación / Boost de par manual)",
    "defecto": "0.0 %",
    "rango": "0.0% - 30.0% de la tensión nominal",
    "tu_valor": "2.0 %",
    "notas": "Sube el voltaje a bajas revoluciones para vencer la inercia en el arranque.",
    "pagina_pdf": 18
},

// ==========================================
// GRUPO P05: BORNES DE ENTRADA DIGITAL (X1 - X4)
// ==========================================
{
    "codigo": "P05.01",
    "nombre": "X1 terminal function selection (Función borne digital X1)",
    "defecto": "1",
    "rango": "0: No function; 1: Forward running (Marcha Adelante - FWD); 2: Reverse running (REV); 3: 3-wire control; 4: Forward JOG; 5: Reverse JOG; 6: Free stop (Parada libre)",
    "tu_valor": "1",
    "notas": "Asigna el borne X1 para activar el giro adelante al recibir 24V.",
    "pagina_pdf": 19
},
{
    "codigo": "P05.02",
    "nombre": "X2 terminal function selection (Función borne digital X2)",
    "defecto": "2",
    "rango": "0: No function; 1: FWD; 2: Reverse running (Marcha Atrás - REV); 3: 3-wire control; 7: Fault reset (RST)",
    "tu_valor": "2",
    "notas": "Asigna el borne X2 para forzar el sentido inverso.",
    "pagina_pdf": 19
},
{
    "codigo": "P05.07",
    "nombre": "Terminal control mode (Modo de control por bornes externos)",
    "defecto": "0",
    "rango": "0: 2-wire control 1 (FWD/REV fijos); 1: 2-wire control 2; 2: 3-wire control 1; 3: 3-wire control 2",
    "tu_valor": "0",
    "notas": "El modo 0 emplea interruptores convencionales abiertos/cerrados para la marcha.",
    "pagina_pdf": 20
},

// ==========================================
// GRUPO P06: BORNES DE SALIDA (RELÉ TA/TB/TC)
// ==========================================
{
    "codigo": "P06.02",
    "nombre": "Relay output function selection (Función de la salida de relé TA/TC)",
    "defecto": "2",
    "rango": "0: No output; 1: Inverter running (Variador marchando); 2: Fault output (Salida de Fallo/Alarma); 3: Frequency level detection (FDT); 4: Zero speed",
    "tu_valor": "2",
    "notes": "El relé conmuta sus contactos de alarma si el variador entra en protección/fallo.",
    "pagina_pdf": 21
},

// ==========================================
// GRUPO P07: ENTRADAS/SALIDAS ANALÓGICAS (AI1, AI2, AO)
// ==========================================
{
    "codigo": "P07.01",
    "nombre": "AI1 lower limit voltage input (Voltaje mínimo AI1)",
    "defecto": "0.00 V",
    "rango": "0.00V - AI1 upper limit (P07.03)",
    "tu_valor": "0.00 V",
    "notas": "Corresponde al mínimo del potenciómetro o señal analógica externa.",
    "pagina_pdf": 22
},
{
    "codigo": "P07.03",
    "nombre": "AI1 upper limit voltage input (Voltaje máximo AI1)",
    "defecto": "10.00 V",
    "rango": "AI1 lower limit (P07.01) - 10.00V",
    "tu_valor": "10.00 V",
    "notas": "Fija los 10V como el valor de referencia para el 100% de la frecuencia.",
    "pagina_pdf": 22
},

// ==========================================
// GRUPO P11: PROTECCIÓN Y FALLOS COMPLEMENTARIOS
// ==========================================
{
    "codigo": "P11.01",
    "nombre": "Overcurrent stall prevention selection (Prevención de pérdida por sobrecorriente)",
    "defecto": "1",
    "rango": "0: Disabled; 1: Enabled during acceleration/deceleration/constant speed",
    "tu_valor": "1",
    "notas": "Reduce de forma automática los Hz si detecta un pico peligroso de amperios.",
    "pagina_pdf": 26
}
];
