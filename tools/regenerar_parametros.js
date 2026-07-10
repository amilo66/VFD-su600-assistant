const fs = require('fs');
const path = require('path');

const PARAMS_DIR = path.join(__dirname, '..', 'data', 'su600', 'parametros');

// Datos extraídos del manual SU-600
const datosManuales = {
    'F0': [
        {
            codigo: 'F0.00',
            nombre: 'Functional macro definition',
            opciones: [
                { valor: '0', descripcion: 'General mode' },
                { valor: '1', descripcion: 'Single pump constant pressure water supply mode' },
                { valor: '2~3', descripcion: 'Keep' },
                { valor: '4', descripcion: 'Engraver machine mode' },
                { valor: '5~10', descripcion: 'Hold on' }
            ],
            rango: '0~10',
            fabrica: '0'
        },
        {
            codigo: 'F0.01',
            nombre: 'Motor control mode',
            opciones: [
                { valor: '0', descripcion: 'VF control' },
                { valor: '1', descripcion: 'Advanced VF control' },
                { valor: '2', descripcion: 'Simple vector control' },
                { valor: '3', descripcion: 'Advanced vector control' },
                { valor: '4', descripcion: 'Torque control' }
            ],
            rango: '0~4',
            fabrica: '0'
        },
        {
            codigo: 'F0.02',
            nombre: 'Run command channel selection',
            opciones: [
                { valor: '0', descripcion: 'Panel runs the command channel' },
                { valor: '1', descripcion: 'Terminal run command channel' },
                { valor: '2', descripcion: 'Communication running command channel' }
            ],
            rango: '0~2',
            fabrica: '0'
        },
        {
            codigo: 'F0.03',
            nombre: 'Frequency given choice',
            opciones: [
                { valor: '0', descripcion: 'Panel potentiometer' },
                { valor: '1', descripcion: 'Number given 1, operation panel ▲▼ key adjustment' },
                { valor: '2', descripcion: 'Number given 2, terminal UP/DOWN adjustment' },
                { valor: '3', descripcion: 'AI simulation given (0~10V/0~20mA)' },
                { valor: '4', descripcion: 'Combination given' },
                { valor: '5', descripcion: 'Keep' },
                { valor: '6', descripcion: 'Communication given' },
                { valor: '7', descripcion: 'Keep' }
            ],
            rango: '0~7',
            fabrica: '0'
        },
        {
            codigo: 'F0.04',
            nombre: 'Maximum output frequency',
            descripcion: 'The maximum output frequency is the highest frequency allowed by the converter and is the benchmark for acceleration and deceleration.',
            rango: 'MAX{50.0, [F0.05]}~999.9Hz',
            fabrica: '50.0Hz'
        },
        {
            codigo: 'F0.05',
            nombre: 'Upper limiting frequency',
            descripcion: 'The operating frequency cannot exceed this frequency.',
            rango: 'MAX{0.1, [F0.06]}~[F0.04]',
            fabrica: '50.0Hz'
        },
        {
            codigo: 'F0.06',
            nombre: 'Lower limit frequency',
            descripcion: 'The running frequency cannot be below this frequency.',
            rango: '0.0~Upper limit frequency',
            fabrica: '0.0Hz'
        },
        {
            codigo: 'F0.07',
            nombre: 'Lower bound frequency reaches the processing',
            opciones: [
                { valor: '0', descripcion: 'Zero speed operation' },
                { valor: '1', descripcion: 'Operating at lower limit frequency' },
                { valor: '2', descripcion: 'Stop' }
            ],
            rango: '0~2',
            fabrica: '0'
        },
        {
            codigo: 'F0.08',
            nombre: 'Run the frequency number setting',
            descripcion: 'This setpoint is the frequency number given the initial value.',
            rango: '0.0~Upper limit frequency',
            fabrica: '10.0Hz'
        },
        {
            codigo: 'F0.09',
            nombre: 'Digital frequency control',
            descripcion: 'LED single bit: power-out storage. LED ten-place: shutdown maintenance. LED 100 bits: UP/DOWN negative frequency regulation. LED thousand bits: PID, PLC frequency superposition selection.',
            rango: '0000~2111',
            fabrica: '0000'
        },
        {
            codigo: 'F0.10',
            nombre: 'Acceleration time',
            descripcion: 'It takes the time for the inverter to accelerate from the zero frequency to the maximum output frequency.',
            rango: '0.1~999.9s',
            fabrica: 'Model setting'
        },
        {
            codigo: 'F0.11',
            nombre: 'Deceleration time',
            descripcion: 'The time required for the inverter to slow down from the maximum output frequency to the zero frequency.',
            rango: '0.1~999.9s',
            fabrica: 'Model setting'
        },
        {
            codigo: 'F0.12',
            nombre: 'Operation direction setting',
            opciones: [
                { valor: '0', descripcion: 'Forward turn' },
                { valor: '1', descripcion: 'Reverse' },
                { valor: '2', descripcion: 'No reversal' }
            ],
            rango: '0~2',
            fabrica: '0'
        },
        {
            codigo: 'F0.13',
            nombre: 'V/F curve setting',
            opciones: [
                { valor: '0', descripcion: 'Linear curve' },
                { valor: '1', descripcion: 'Square curve' },
                { valor: '2', descripcion: 'Multipoint VF curve' }
            ],
            rango: '0~2',
            fabrica: '0'
        },
        {
            codigo: 'F0.14',
            nombre: 'Recurrent lift',
            descripcion: 'Manual torque lift which is the percentage relative to the motor voltage.',
            rango: '0.0~30.0%',
            fabrica: 'Model setting'
        },
        {
            codigo: 'F0.15',
            nombre: 'Torque lift cutoff frequency',
            descripcion: 'This setting is the lift cut-off frequency point for the manual torque lift.',
            rango: '0.0~50.0Hz',
            fabrica: '15.0Hz'
        },
        {
            codigo: 'F0.16',
            nombre: 'The carrier frequency setting',
            descripcion: 'For the occasion of silent operation, the carrier frequency can be appropriately increased.',
            rango: '2.0~16.0kHz',
            fabrica: 'Model setting'
        },
        {
            codigo: 'F0.23',
            nombre: 'User password',
            descripcion: 'Set any non-zero number for 3 minutes or a power failure to take effect.',
            rango: '0~9999',
            fabrica: '0'
        },
        {
            codigo: 'F0.24',
            nombre: 'Frequency display resolution selection',
            opciones: [
                { valor: '0', descripcion: '0.1Hz' },
                { valor: '1', descripcion: '1Hz' }
            ],
            rango: '0~1',
            fabrica: '0'
        }
    ],
    'F1': [
        {
            codigo: 'F1.00',
            nombre: 'Start way',
            descripcion: 'LED bit: starting mode. LED ten: power failure or abnormal restart mode.',
            rango: '0000~0012',
            fabrica: '00'
        },
        {
            codigo: 'F1.01',
            nombre: 'Frequency of starting',
            rango: '0.0~50.0Hz',
            fabrica: '1.0Hz'
        },
        {
            codigo: 'F1.02',
            nombre: 'Start the DC brake voltage',
            rango: '0.0~50.0%×motor rated voltage',
            fabrica: '0.0%'
        },
        {
            codigo: 'F1.03',
            nombre: 'Start the DC brake time',
            rango: '0.0~30.0s',
            fabrica: '0.0s'
        },
        {
            codigo: 'F1.04',
            nombre: 'Downtime method',
            opciones: [
                { valor: '0', descripcion: 'Deceleration shutdown' },
                { valor: '1', descripcion: 'Free shutdown' }
            ],
            rango: '0~1',
            fabrica: '0'
        },
        {
            codigo: 'F1.09',
            nombre: 'Set the moving frequency of the positive turning point',
            descripcion: 'Set the point movement forward and reverse frequency.',
            rango: '0.0~50.0Hz',
            fabrica: '10.0Hz'
        },
        {
            codigo: 'F1.10',
            nombre: 'Insert the point frequency setting',
            descripcion: 'Set the point movement forward and reverse frequency.',
            rango: '0.0~50.0Hz',
            fabrica: '10.0Hz'
        },
        {
            codigo: 'F1.13',
            nombre: 'Jump frequency',
            descripcion: 'By setting the jump frequency and range, the frequency converter can avoid the mechanical resonance point of the load.',
            rango: '0.0~Upper limit frequency',
            fabrica: '0.0Hz'
        },
        {
            codigo: 'F1.14',
            nombre: 'Jump range',
            descripcion: 'By setting the jump frequency and range, the frequency converter can avoid the mechanical resonance point of the load.',
            rango: '0.0~10.0Hz',
            fabrica: '0.0Hz'
        },
        {
            codigo: 'F1.17',
            nombre: 'Multi-segment speed frequency 1',
            descripcion: 'Set the segment speed-1 frequency.',
            rango: '-Upper limit frequency~upper limit frequency',
            fabrica: '5.0Hz'
        },
        {
            codigo: 'F1.18',
            nombre: 'Multi-segment speed frequency 2',
            descripcion: 'Set the segment speed of 2 frequency.',
            rango: '-Upper limit frequency~upper limit frequency',
            fabrica: '10.0Hz'
        },
        {
            codigo: 'F1.19',
            nombre: 'Multi-segment speed frequency 3',
            descripcion: 'Set the segment speed of 3 frequency.',
            rango: '-Upper limit frequency~upper limit frequency',
            fabrica: '15.0Hz'
        },
        {
            codigo: 'F1.20',
            nombre: 'Multi-segment speed frequency 4',
            descripcion: 'Set the segment speed of 4 frequency.',
            rango: 'Upper limit frequency~upper limit frequency',
            fabrica: '20.0Hz'
        },
        {
            codigo: 'F1.21',
            nombre: 'Multi-segment speed frequency 5',
            descripcion: 'Set the segment speed of 5 frequency.',
            rango: '-Upper limit frequency~upper limit frequency',
            fabrica: '25.0Hz'
        },
        {
            codigo: 'F1.22',
            nombre: 'Multi-segment speed frequency 6',
            descripcion: 'Set the segment speed of 6 frequency.',
            rango: '-Upper limit frequency~upper limit frequency',
            fabrica: '37.5Hz'
        },
        {
            codigo: 'F1.23',
            nombre: 'Multi-segment speed frequency 7',
            descripcion: 'Set the segment speed of 7 frequency.',
            rango: '-Upper limit frequency~upper limit frequency',
            fabrica: '50.0Hz'
        }
    ],
    'F2': [
        {
            codigo: 'F2.00',
            nombre: 'AI input lower limit voltage',
            descripcion: 'Set the AI upper and lower limit voltage.',
            rango: '0.00~[F2.01]',
            fabrica: '0.00V'
        },
        {
            codigo: 'F2.01',
            nombre: 'AI input upper limit voltage',
            descripcion: 'Set the AI upper and lower limit voltage.',
            rango: '[F2.01]~10.00V',
            fabrica: '10.00V'
        },
        {
            codigo: 'F2.02',
            nombre: 'The lower AI limit shall be set accordingly',
            descripcion: 'Setting the upper and lower limits of the AI corresponds to the setting, which corresponds to the percentage of the upper limit frequency [F0.05].',
            rango: '-100.0%~100.0%',
            fabrica: '0.0%'
        },
        {
            codigo: 'F2.03',
            nombre: 'The upper limit of AI is set accordingly',
            descripcion: 'Setting the upper and lower limits of the AI corresponds to the setting, which corresponds to the percentage of the upper limit frequency [F0.05].',
            rango: '-100.0%~100.0%',
            fabrica: '100.0%'
        },
        {
            codigo: 'F2.08',
            nombre: 'Filtering time constant of the simulated input signal',
            descripcion: 'This parameter is used to filter the input signals of the AI and panel potentiometer to eliminate the influence of interference.',
            rango: '0.1~5.0s',
            fabrica: '0.1s'
        },
        {
            codigo: 'F2.10',
            nombre: 'AO analog quantity output terminal function selection',
            opciones: [
                { valor: '0', descripcion: 'Output frequency' },
                { valor: '1', descripcion: 'Output current' },
                { valor: '2', descripcion: 'Motor speed' },
                { valor: '3', descripcion: 'Output voltage' },
                { valor: '4', descripcion: 'AI' },
                { valor: '5', descripcion: 'Keep' }
            ],
            rango: '0~5',
            fabrica: '0'
        },
        {
            codigo: 'F2.11',
            nombre: 'AO bottoming',
            descripcion: 'Set the upper and lower limits of the AO output.',
            rango: '0.00~10.00V/0.00~20.00mA',
            fabrica: '0.00V'
        },
        {
            codigo: 'F2.12',
            nombre: 'AO output upper limit',
            descripcion: 'Set the upper and lower limits of the AO output.',
            rango: '0.00~10.00V/0.00~20.00mA',
            fabrica: '10.00V'
        },
        {
            codigo: 'F2.13',
            nombre: 'Input terminal X1 function',
            descripcion: '0: Control end idle. 1: Forward point control. 2: Reverse point control. 3: Forward rotation control (FWD). 4: Reverse Control (REV). 5: Three-line operation control. 6: Free shutdown control. 7: External shutdown signal input (STOP). 8: External reset signal input (RST). 9: External fault open input. 10: Frequency increase instruction (UP). 11: Frequency decreasing instruction (DOWN).',
            rango: '0~60',
            fabrica: '3'
        },
        {
            codigo: 'F2.14',
            nombre: 'Input terminal X2 function',
            descripcion: 'Same options as X1.',
            rango: '0~60',
            fabrica: '4'
        },
        {
            codigo: 'F2.15',
            nombre: 'Input terminal X3 function',
            descripcion: 'Same options as X1.',
            rango: '0~60',
            fabrica: '0'
        },
        {
            codigo: 'F2.16',
            nombre: 'Input terminal X4 function',
            descripcion: 'Same options as X1.',
            rango: '0~60',
            fabrica: '0'
        },
        {
            codigo: 'F2.18',
            nombre: 'The FWD/REV terminal control mode',
            opciones: [
                { valor: '0', descripcion: 'Second-line control mode 1' },
                { valor: '1', descripcion: 'Second-line control mode 2' },
                { valor: '2', descripcion: 'Three-line control mode 1' },
                { valor: '3', descripcion: 'Three-line control mode 2' },
                { valor: '4', descripcion: 'Three-line control mode 3' },
                { valor: '5', descripcion: 'Keep' }
            ],
            rango: '0~5',
            fabrica: '0'
        },
        {
            codigo: 'F2.20',
            nombre: 'R Output Settings',
            opciones: [
                { valor: '0', descripcion: 'Idle' },
                { valor: '1', descripcion: 'The frequency converter is ready for operation' },
                { valor: '2', descripcion: 'Converter in operation' },
                { valor: '3', descripcion: 'Converter in operation at zero speed' },
                { valor: '4', descripcion: 'External fault shutdown' },
                { valor: '5', descripcion: 'Inverter fault' },
                { valor: '6', descripcion: 'Frequency/speed arrival signal (FAR)' },
                { valor: '7', descripcion: 'Frequency/speed level detection signal (FDT)' }
            ],
            rango: '0~20',
            fabrica: '5'
        },
        {
            codigo: 'F2.24',
            nombre: 'Frequency reaches the FAR detection amplitude',
            descripcion: 'The output frequency is in the positive and negative detection width of the set frequency.',
            rango: '0.0Hz~15.0Hz',
            fabrica: '5.0Hz'
        },
        {
            codigo: 'F2.25',
            nombre: 'The FDT level setpoint',
            rango: '0.0Hz~Upper limit frequency',
            fabrica: '10.0Hz'
        },
        {
            codigo: 'F2.26',
            nombre: 'FDT lag values',
            rango: '0.0~30.0Hz',
            fabrica: '1.0Hz'
        },
        {
            codigo: 'F2.27',
            nombre: 'The UP/DOWN terminal modification rate',
            descripcion: 'This function code is the frequency modification rate when setting the frequency of the UP/DOWN terminal.',
            rango: '0.1Hz~99.9Hz/s',
            fabrica: '1.0Hz/s'
        },
        {
            codigo: 'F2.30',
            nombre: 'X1 Filter coefficient',
            descripcion: 'To set the sensitivity of the input terminals.',
            rango: '0~9999',
            fabrica: '5'
        },
        {
            codigo: 'F2.31',
            nombre: 'X2 filtering coefficient',
            descripcion: 'To set the sensitivity of the input terminals.',
            rango: '0~9999',
            fabrica: '5'
        },
        {
            codigo: 'F2.32',
            nombre: 'X3 filtering coefficient',
            descripcion: 'To set the sensitivity of the input terminals.',
            rango: '0~9999',
            fabrica: '5'
        },
        {
            codigo: 'F2.33',
            nombre: 'X4 Filter coefficient',
            descripcion: 'To set the sensitivity of the input terminals.',
            rango: '0~9999',
            fabrica: '5'
        },
        {
            codigo: 'F2.35',
            nombre: 'Shutdown delay time',
            descripcion: 'If there is no change in the high or low level of the terminal within the time range set in this parameter, the frequency converter will stop.',
            rango: '0.0~60s',
            fabrica: '2'
        }
    ],
    'F3': [
        {
            codigo: 'F3.00',
            nombre: 'The PID function setting',
            descripcion: 'LED single bit: PID adjusting property. LED ten place: PID to the quantitative input channel. LED 100 bits: PID feedback quantity input channel. LED thousand bits: PID Sleep selection.',
            rango: '0000~2122',
            fabrica: '1010'
        },
        {
            codigo: 'F3.01',
            nombre: 'Set the quantitative number',
            descripcion: 'The operation keyboard is used to set the quantification of PID control.',
            rango: '0.0~100.0%',
            fabrica: '0.0%'
        },
        {
            codigo: 'F3.02',
            nombre: 'Feedback channel gain',
            descripcion: 'When the feedback channel is not consistent with the set channel level, the feedback channel signal.',
            rango: '0.01~10.00',
            fabrica: '1.00'
        },
        {
            codigo: 'F3.03',
            nombre: 'Proportional gain P',
            descripcion: 'The speed of PID adjustment speed is set by the two parameters of proportional gain and integration time.',
            rango: '0.01~5.00',
            fabrica: '2.00'
        },
        {
            codigo: 'F3.04',
            nombre: 'Integration time Ti',
            descripcion: 'The speed of PID adjustment speed is set by the two parameters of proportional gain and integration time.',
            rango: '0.1~50.0s',
            fabrica: '1.0s'
        },
        {
            codigo: 'F3.05',
            nombre: 'Rate time Td',
            descripcion: 'The speed of PID adjustment speed is set by the two parameters of proportional gain and integration time.',
            rango: '0.1~10.0s',
            fabrica: '0.0s'
        },
        {
            codigo: 'F3.06',
            nombre: 'Sampling period T',
            descripcion: 'The larger the sampling period, the slower the response, but the better the inhibition effect on the interference signal.',
            rango: '0.1~10.0s',
            fabrica: '0.0s'
        },
        {
            codigo: 'F3.07',
            nombre: 'Deviation limit',
            descripcion: 'The deviation limit is the ratio of the absolute value of the system feedback to the deviation of the given quantification.',
            rango: '0.0~20.0%',
            fabrica: '0.0%'
        },
        {
            codigo: 'F3.08',
            nombre: 'Closed loop preset frequency',
            descripcion: 'Frequency and operation time of frequency converter before PID is put into operation.',
            rango: '0.0~Upper limit frequency',
            fabrica: '0.0Hz'
        },
        {
            codigo: 'F3.09',
            nombre: 'Preset the frequency hold time',
            descripcion: 'Frequency and operation time of frequency converter before PID is put into operation.',
            rango: '0.0~999.9s',
            fabrica: '0.0s'
        },
        {
            codigo: 'F3.10',
            nombre: 'Sleep valve value coefficient',
            descripcion: 'If the actual feedback value is greater than the set value and the output frequency reaches the lower frequency, the inverter enters the sleep state.',
            rango: '0.0~150.0%',
            fabrica: '100.0%'
        },
        {
            codigo: 'F3.11',
            nombre: 'Awakening valve value coefficient',
            descripcion: 'If the actual feedback value is less than the set value, the frequency converter after the delayed waiting time defined by F3.13.',
            rango: '0.0~150.0%',
            fabrica: '90.0%'
        },
        {
            codigo: 'F3.12',
            nombre: 'Sleep delay time',
            descripcion: 'Set the sleep delay time.',
            rango: '0.0~999.9s',
            fabrica: '100.0s'
        },
        {
            codigo: 'F3.13',
            nombre: 'Wake up delay time',
            descripcion: 'Set the wake-up delay time.',
            rango: '0.0~999.9s',
            fabrica: '1.0s'
        },
        {
            codigo: 'F3.14',
            nombre: 'Deviation between feedback and set pressure during sleep',
            descripcion: 'This functional parameter is only valid for disturbed dormancy mode.',
            rango: '0.0~10.0%',
            fabrica: '0.5%'
        },
        {
            codigo: 'F3.15',
            nombre: 'Doom tube detection delay time',
            descripcion: 'Set the tube burst detection delay time.',
            rango: '0.0~130.0s',
            fabrica: '0.5s'
        },
        {
            codigo: 'F3.16',
            nombre: 'High pressure test valve value',
            descripcion: 'When the feedback pressure is greater than or equal to this set value, the fault is reported "EPA0" after the F3.15 burst delay.',
            rango: '0.0~200.0%',
            fabrica: '150.0%'
        },
        {
            codigo: 'F3.17',
            nombre: 'Low pressure detection valve value',
            descripcion: 'When the feedback pressure is less than this set value, report the burst fault "EPA0" after F3.15 delay.',
            rango: '0.0~200.0%',
            fabrica: '50.0%'
        },
        {
            codigo: 'F3.18',
            nombre: 'Sensor range',
            descripcion: 'Set the maximum range of the sensor.',
            rango: '0.00~99.99(MPa, Kg)',
            fabrica: '10.00MPa'
        }
    ],
    'F4': [
        {
            codigo: 'F4.00',
            nombre: 'The motor is rated power',
            descripcion: 'Motor parameter setting.',
            rango: '0.0~2000.0kW',
            fabrica: 'Model setting'
        },
        {
            codigo: 'F4.01',
            nombre: 'The motor is rated voltage',
            descripcion: 'Motor parameter setting.',
            rango: '0~500V: 380V, 0~250V: 220V',
            fabrica: 'Model setting'
        },
        {
            codigo: 'F4.02',
            nombre: 'Rated current of motor',
            descripcion: 'Motor parameter setting.',
            rango: '0.1~999.9A',
            fabrica: 'Model setting'
        },
        {
            codigo: 'F4.03',
            nombre: 'Rated frequency of motor',
            descripcion: 'Motor parameter setting.',
            rango: '1.0~999.9Hz',
            fabrica: '50.0Hz'
        },
        {
            codigo: 'F4.04',
            nombre: 'Motor rated speed',
            descripcion: 'Motor parameter setting.',
            rango: '0~9999RPM',
            fabrica: 'Model setting'
        },
        {
            codigo: 'F4.05',
            nombre: 'No-load current of motor',
            descripcion: 'Set the motor.',
            rango: '0.1A~[F4.01]',
            fabrica: 'Model setting'
        },
        {
            codigo: 'F4.06',
            nombre: 'AVR function',
            opciones: [
                { valor: '0', descripcion: 'Invalid' },
                { valor: '1', descripcion: 'The whole process is effective' },
                { valor: '2', descripcion: 'Invalid only for deceleration' }
            ],
            rango: '0~2',
            fabrica: '0'
        },
        {
            codigo: 'F4.07',
            nombre: 'Cooling fan control',
            opciones: [
                { valor: '0', descripcion: 'Automatic control mode' },
                { valor: '1', descripcion: 'The power-on process is always running' }
            ],
            rango: '0~1',
            fabrica: '0'
        },
        {
            codigo: 'F4.08',
            nombre: 'Number of automatic reset',
            descripcion: 'When the number of barrier reset is set to 0, there is no automatic reset function.',
            rango: '0~10',
            fabrica: '0'
        },
        {
            codigo: 'F4.09',
            nombre: 'Automatic fault reset interval time',
            descripcion: 'Set the fault automatic reset interval time.',
            rango: '0.5~25.0s',
            fabrica: '3.0s'
        },
        {
            codigo: 'F4.10',
            nombre: 'Energy consumption brake start voltage',
            descripcion: 'If the internal DC side voltage of the converter is higher than the energy braking start voltage, the built-in brake unit moves.',
            rango: '330~380/660~800V',
            fabrica: '350/780V'
        },
        {
            codigo: 'F4.11',
            nombre: 'Energy consumption braking action ratio',
            descripcion: 'The voltage energy raised inside the frequency converter will be released through the brake resistance.',
            rango: '10~100%',
            fabrica: '100%'
        },
        {
            codigo: 'F4.12',
            nombre: 'Overmodulation function selection',
            opciones: [
                { valor: '0', descripcion: 'Invalid' },
                { valor: '1', descripcion: 'Valid' }
            ],
            rango: '0~1',
            fabrica: '0'
        },
        {
            codigo: 'F4.16',
            nombre: 'Motor parameters by self-learning',
            opciones: [
                { valor: '0', descripcion: 'Invalid' },
                { valor: '1', descripcion: 'Static self-learning' }
            ],
            rango: '0~1',
            fabrica: '0'
        },
        {
            codigo: 'F4.17',
            nombre: 'Motor stator resistance',
            descripcion: 'After changing the rated motor power, parameters are automatically updated.',
            rango: '0.00~200.00Ω',
            fabrica: 'Model setting'
        },
        {
            codigo: 'F4.18',
            nombre: 'Motor rotor resistance',
            descripcion: 'After changing the rated motor power, parameters are automatically updated.',
            rango: '0.00~200.00Ω',
            fabrica: 'Model setting'
        },
        {
            codigo: 'F4.19',
            nombre: 'Motor fixed, rotor mutual sense',
            descripcion: 'After changing the rated motor power, parameters are automatically updated.',
            rango: '0.00~200.00mH',
            fabrica: 'Model setting'
        },
        {
            codigo: 'F4.20',
            nombre: 'Motor is set, the rotor leakage sense',
            descripcion: 'After changing the rated motor power, parameters are automatically updated.',
            rango: '0.00~200.00mH',
            fabrica: 'Model setting'
        },
        {
            codigo: 'F4.21',
            nombre: 'Speed loop (ASR 1) proportional gain',
            descripcion: 'Function codes F4.21~F4.26 are valid in the vector control mode.',
            rango: '1~100',
            fabrica: '30'
        },
        {
            codigo: 'F4.22',
            nombre: 'The velocity loop (ASR 1) integration time',
            descripcion: 'Function codes F4.21~F4.26 are valid in the vector control mode.',
            rango: '0.01~10.00s',
            fabrica: '0.50'
        },
        {
            codigo: 'F4.27',
            nombre: 'Vector transfer difference compensation',
            descripcion: 'In the vector control mode, this parameter is used to adjust the speed accuracy of the motor.',
            rango: '50%~200%',
            fabrica: '100'
        },
        {
            codigo: 'F4.30',
            nombre: 'Speed loop torque limit',
            descripcion: 'This set point is the percentage of the rated current of the motor.',
            rango: '0.0%~200.0%',
            fabrica: '170.0'
        },
        {
            codigo: 'F4.32',
            nombre: 'The torque number is given',
            descripcion: 'This set point is the percentage of the rated current of the motor.',
            rango: '0.0%~200.0%×The rated current of the motor',
            fabrica: '150.0'
        },
        {
            codigo: 'F4.33',
            nombre: 'Torque controls the forward maximum frequency',
            descripcion: 'Used to set the forward or reverse maximum operating frequency under torque control mode.',
            rango: '0.0~3200.0Hz',
            fabrica: '50.0'
        },
        {
            codigo: 'F4.34',
            nombre: 'Torque control of the reverse maximum frequency',
            descripcion: 'Used to set the forward or reverse maximum operating frequency under torque control mode.',
            rango: '0.0~3200.0Hz',
            fabrica: '50.0'
        },
        {
            codigo: 'F4.35',
            nombre: 'Recurrent up time',
            descripcion: 'Torque rise/fall time defines the time when the torque rises from 0 to maximum or falls from maximum to 0.',
            rango: '0.00~1.00s',
            fabrica: '0.00'
        },
        {
            codigo: 'F4.36',
            nombre: 'Torque drop time',
            descripcion: 'Torque rise/fall time defines the time when the torque rises from 0 to maximum or falls from maximum to 0.',
            rango: '0.00~1.00s',
            fabrica: '0.00'
        }
    ],
    'F5': [
        {
            codigo: 'F5.00',
            nombre: 'Protection Settings',
            descripcion: 'LED single bit: motor overload protection selection. LED ten place: PID feedback line break protection. LED 100 bit: 485 communication failure processing. LED thousand: shock suppression selection.',
            rango: '0000~1211',
            fabrica: '0001'
        },
        {
            codigo: 'F5.01',
            nombre: 'Motor overload protection factor',
            descripcion: 'The overload protection coefficient of the motor is the percentage of the rated current value of the motor to the rated output current value of the frequency converter.',
            rango: '30%~110%',
            fabrica: '100%'
        },
        {
            codigo: 'F5.02',
            nombre: 'Under-pressure protection level',
            descripcion: 'This function code specifies the allowable lower limit voltage of the DC bus when the frequency converter is working normally.',
            rango: '50~280/50~480V',
            fabrica: '180/360V'
        },
        {
            codigo: 'F5.03',
            nombre: 'Reduced-down voltage limit factor',
            descripcion: 'This parameter is used to adjust the ability of the inverter to suppress overvoltage during deceleration.',
            rango: '0: Off, 1~255',
            fabrica: '1'
        },
        {
            codigo: 'F5.04',
            nombre: 'Overpressure limit level',
            descripcion: 'The overvoltage limit level defines the action voltage during the overvoltage stall protection.',
            rango: '350~400/660~850V',
            fabrica: '375/700V'
        },
        {
            codigo: 'F5.05',
            nombre: 'Accelerated current limiting coefficient',
            descripcion: 'This parameter is used to regulate the ability of the frequency converter to suppress overflow during acceleration.',
            rango: '0: Off, 1~99',
            fabrica: '10'
        },
        {
            codigo: 'F5.06',
            nombre: 'Constant-speed current limiting coefficient',
            descripcion: 'This parameter is used to regulate the ability of the frequency converter to suppress overflow at a constant speed.',
            rango: '0: Off, 1~10',
            fabrica: '0'
        },
        {
            codigo: 'F5.07',
            nombre: 'Current limit level',
            descripcion: 'The current limit level defines the current threshold of the automatic current limiting action.',
            rango: '50%~200%',
            fabrica: '160%'
        },
        {
            codigo: 'F5.08',
            nombre: 'Feedback on the break line detection value',
            descripcion: 'This value is the percentage of PID. When the feedback value of PID is continuously less than the feedback break detection value, the frequency converter will make corresponding protection action.',
            rango: '0.0~100.0%',
            fabrica: '0.0%'
        },
        {
            codigo: 'F5.09',
            nombre: 'Feedback break detection time',
            descripcion: 'Delay time before the protection action after the feedback disconnection occurs.',
            rango: '0.1~999.9s',
            fabrica: '10.0s'
        },
        {
            codigo: 'F5.10',
            nombre: 'Frequency converter overload forecast alarm level',
            descripcion: 'The current threshold of the inverter overload forecast alarm action is the percentage relative to the rated current of the frequency converter.',
            rango: '0~150%',
            fabrica: '120%'
        },
        {
            codigo: 'F5.11',
            nombre: 'Frequency converter overload forecast alarm delay',
            descripcion: 'The output current of the inverter ranges from the overload forecast alarm level amplitude to the delay time between the output overload pre-alarm signal.',
            rango: '0.0~15.0s',
            fabrica: '5.0s'
        },
        {
            codigo: 'F5.12',
            nombre: 'Point action priority enables',
            opciones: [
                { valor: '0', descripcion: 'Invalid' },
                { valor: '1', descripcion: 'When the inverter is running, the highest priority' }
            ],
            rango: '0~1',
            fabrica: '0'
        },
        {
            codigo: 'F5.13',
            nombre: 'Inhibition coefficient of oscillations',
            descripcion: 'When the motor shocks, set F5.00 thousand bits effective, open the shock suppression function.',
            rango: '0~200',
            fabrica: '30'
        },
        {
            codigo: 'F5.14',
            nombre: 'The amplitude inhibition coefficient',
            descripcion: 'When the motor shocks, set F5.00 thousand bits effective, open the shock suppression function.',
            rango: '0~12',
            fabrica: '5'
        },
        {
            codigo: 'F5.15',
            nombre: 'The lower limit of the oscillation suppression frequency',
            descripcion: 'When the motor shocks, set F5.00 thousand bits effective, open the shock suppression function.',
            rango: '0.0~[F5.16]',
            fabrica: '5.0Hz'
        },
        {
            codigo: 'F5.16',
            nombre: 'Oscillatory suppression at the ceiling frequency',
            descripcion: 'When the motor shocks, set F5.00 thousand bits effective, open the shock suppression function.',
            rango: '[F5.15]~[F0.05]',
            fabrica: '45.0Hz'
        },
        {
            codigo: 'F5.17',
            nombre: 'Wave-by-wave flow restriction selection',
            descripcion: 'LED bits: Select 0 in acceleration: Invalid, 1: valid. LED ten: select 0 in deceleration: Invalid, 1: valid. LED 100 bits: selected from the constant speed: 0: Invalid, 1: valid. LED thousand bits: dead area compensation selection: 0: Invalid, 1: valid.',
            rango: '000~1111',
            fabrica: '1011'
        },
        {
            codigo: 'F5.18',
            nombre: 'Output is missing the phase protection detection factor',
            descripcion: 'When the ratio of maximum and minimum value in three-phase output current is greater than this coefficient and the duration exceeds 6 seconds, the inverter reports the output current imbalance fault EPLI.',
            rango: '0.00~20.00',
            fabrica: '2.00'
        },
        {
            codigo: 'F5.19',
            nombre: 'The decrease coefficient of the instantaneous power drop frequency',
            descripcion: 'Set the instantaneous drop frequency drop coefficient.',
            rango: '0: Function invalid, 1~9999',
            fabrica: '0'
        },
        {
            codigo: 'F5.20',
            nombre: 'Instant power drop frequency point',
            descripcion: 'Set the instantaneous power drop frequency drop point.',
            rango: '220V: 180~330V/250V, 380V: 300~550V/450V',
            fabrica: 'Model setting'
        },
        {
            codigo: 'F5.21',
            nombre: 'Low-frequency carrier is used for automatic adjustment',
            opciones: [
                { valor: '0', descripcion: 'Invalid' },
                { valor: '1', descripcion: 'Valid' }
            ],
            rango: '0~1',
            fabrica: '1'
        }
    ],
    'F7': [
        {
            codigo: 'F7.00',
            nombre: 'Counting and timing mode',
            descripcion: 'LED bit: count reaches processing. LED ten tens: reserved. LED 100 bits: timing arrival processing. LED thousand bits: reserved.',
            rango: '000~303',
            fabrica: '103'
        },
        {
            codigo: 'F7.01',
            nombre: 'Counter reset value setting',
            descripcion: 'Sets the counter-reset value.',
            rango: '[F7.02]~9999',
            fabrica: '1'
        },
        {
            codigo: 'F7.02',
            nombre: 'Counter detection value setting',
            descripcion: 'Set the counter detection value.',
            rango: '0~[F7.01]',
            fabrica: '1'
        },
        {
            codigo: 'F7.03',
            nombre: 'Timeline time setting',
            descripcion: 'Set timing time.',
            rango: '0~9999s',
            fabrica: '0s'
        },
        {
            codigo: 'F7.08',
            nombre: 'Pop frequency control',
            opciones: [
                { valor: '0', descripcion: 'Prohibit' },
                { valor: '1', descripcion: 'Valid' }
            ],
            rango: '0~1',
            fabrica: '0'
        },
        {
            codigo: 'F7.09',
            nombre: 'Amplitude control',
            opciones: [
                { valor: '0', descripcion: 'Fixed swing. The swing reference value is the maximum output frequency (F0.04).' },
                { valor: '1', descripcion: 'Change the swing. The swing amplitude reference value is the given channel frequency.' }
            ],
            rango: '0~1',
            fabrica: '0'
        },
        {
            codigo: 'F7.10',
            nombre: 'Start mode selection of swing frequency shutdown',
            opciones: [
                { valor: '0', descripcion: 'Start in the state of memory before shutdown' },
                { valor: '1', descripcion: 'Start starting again' }
            ],
            rango: '0~1',
            fabrica: '0'
        },
        {
            codigo: 'F7.11',
            nombre: 'Pressing frequency amplitude',
            descripcion: 'The pendulum frequency amplitude is the percentage relative to the maximum output frequency (F0.04).',
            rango: '0.0~100.0%',
            fabrica: '0.0%'
        },
        {
            codigo: 'F7.12',
            nombre: 'The jump frequency',
            descripcion: 'This function code refers to the range of rapid decline after the frequency reaches the upper frequency of the swing frequency process.',
            rango: '0.0~50.0%',
            fabrica: '0.0%'
        },
        {
            codigo: 'F7.13',
            nombre: 'The time of swing frequency rise',
            descripcion: 'Running time from the swing frequency to the swing frequency.',
            rango: '0.1~3600.0s',
            fabrica: '5.0'
        },
        {
            codigo: 'F7.14',
            nombre: 'The drop time of swing frequency',
            descripcion: 'Running time from the upper swing frequency to the lower swing frequency.',
            rango: '0.1~3600.0s',
            fabrica: '5.0'
        },
        {
            codigo: 'F7.15',
            nombre: 'Upper limit frequency delay',
            descripcion: 'Set the upper and lower limits of swing frequency.',
            rango: '0.1~3600.0s',
            fabrica: '5.0'
        },
        {
            codigo: 'F7.16',
            nombre: 'Lower lower frequency delay',
            descripcion: 'Set the upper and lower limits of swing frequency.',
            rango: '0.1~3600.0s',
            fabrica: '5.0'
        }
    ],
    'F8': [
        {
            codigo: 'F8.00',
            nombre: 'Run to monitor the primary parameter project selection',
            descripcion: 'For example, F8.00=2, to select the output voltage (d-02), then the default display item in the main monitoring interface is the current output voltage value.',
            rango: '0~31',
            fabrica: '0'
        },
        {
            codigo: 'F8.01',
            nombre: 'Downtime monitors the main parameter item selection',
            descripcion: 'For example, F8.01=3, select the bus voltage (d-03), then the default display item in the main monitoring interface is the current bus voltage value.',
            rango: '0~31',
            fabrica: '1'
        },
        {
            codigo: 'F8.02',
            nombre: 'Run Secondary display (valid for dual display only)',
            descripcion: 'For example, F8.02=4, to select the output current (d-02), then the default display item in the main monitoring interface is the current output voltage value.',
            rango: '0~31',
            fabrica: '4'
        },
        {
            codigo: 'F8.03',
            nombre: 'Downtime auxiliary display (valid for dual display only)',
            descripcion: 'For example, F8.03=3, select the bus voltage (d-03), then the default display item in the main monitoring interface is the current bus voltage value.',
            rango: '0~31',
            fabrica: '3'
        },
        {
            codigo: 'F8.04',
            nombre: 'Motor speed display coefficient',
            descripcion: 'Used to correct the speed scale display error, no effect on the actual speed.',
            rango: '0.01~99.99',
            fabrica: '1.00'
        },
        {
            codigo: 'F8.05',
            nombre: 'Parameter initialization',
            opciones: [
                { valor: '0', descripcion: 'No operation. The frequency converter is in the normal parameter reading and writing state.' },
                { valor: '1', descripcion: 'Restore the factory setting. All user parameters shall restore the factory settings according to the model.' },
                { valor: '2', descripcion: 'Clear the fault record. Clear up the contents of the fault record (d-19~d-24).' }
            ],
            rango: '0~2',
            fabrica: '0'
        }
    ],
    'F9': [
        {
            codigo: 'F9.00',
            nombre: 'Manufacturer password',
            rango: '1~9999',
            fabrica: '****'
        }
    ]
};

// Crear directorio si no existe
if (!fs.existsSync(PARAMS_DIR)) {
    fs.mkdirSync(PARAMS_DIR, { recursive: true });
}

// Generar archivos JSON
for (const [grupo, parametros] of Object.entries(datosManuales)) {
    const archivo = path.join(PARAMS_DIR, `${grupo}.json`);
    fs.writeFileSync(archivo, JSON.stringify(parametros, null, 4));
    console.log(`✅ Generado: ${grupo}.json (${parametros.length} parámetros)`);
}

console.log('\n🎉 Todos los archivos JSON han sido regenerados correctamente.');
