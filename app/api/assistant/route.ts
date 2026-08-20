import { NextResponse } from 'next/server';
import { getTopMultados, getIngresosMes, getAsistenciaAsamblea, AsistenciaSnapshot } from '@/lib/assistantFunctions';

type ReqBody = {
  message: string;
  clientSnapshot?: AsistenciaSnapshot | null;
};

async function callNLUService(message: string) {
  // Call external NLU/LLM if configured. Expecting a JSON response { intent: string, entities?: any }
  const url = process.env.ASSISTANT_NLU_URL;
  if (!url) return null;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json;
  } catch (e) {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const body: ReqBody = await req.json();
    const { message /*, clientSnapshot */ } = body; // clientSnapshot handled only when assistance is performed client-side
    const text = (message || '').toLowerCase();

    // If an external NLU is configured, prefer it to parse intent
    const nlu = await callNLUService(message || '');
    let intentFromNLU: string | null = null;
    let entities: any = null;
    if (nlu && typeof nlu === 'object') {
      intentFromNLU = nlu.intent || null;
      entities = nlu.entities || null;
    }

    // Determine intent: NLU if present, otherwise rule-based
    const intentText = intentFromNLU ?? text;

    // 0) Greetings / small talk
    if ((intentFromNLU === 'greeting') || /^(hola|buenas|buenos días|buenas tardes|buenas noches|hey|buen día|buenas noches)(\b|!|\.)/i.test(message || '')) {
      return NextResponse.json({ intent: 'greeting', text: '¡Hola! 👋 Soy el asistente del sistema. Puedes preguntar cosas como: "¿Quién tiene más multas?", "¿Cuánto ingresó por multas en julio 2026?" o "¿Cuántas personas asistieron a la última reunión?"', actions: [{ label: 'Ejemplos', view: 'reportes', params: {} }] });
    }

    // Handle top/least multados
    if ((intentFromNLU === 'top_multados') || /quien|quién|quien tiene|quién tiene|mas multas|más multas|mayor número de multas/.test(text) || (intentFromNLU === 'least_multados') || /menos multas|quien tiene menos|quién tiene menos/.test(text)) {
      const top = getTopMultados(100);
      const wantsLeast = /menos multas|quien tiene menos|quién tiene menos/.test(text) || intentFromNLU === 'least_multados' || (entities && entities.order === 'least');

      if (top.length === 0) {
        return NextResponse.json({ intent: wantsLeast ? 'least_multados' : 'top_multados', text: 'No hay multas registradas.', data: [] });
      }

      if (wantsLeast) {
        // find minimum by count then total
        const sortedAsc = top.slice().sort((a, b) => a.count - b.count || a.total - b.total);
        const least = sortedAsc[0];
        const textResp = `Menos multas: ${least.comuneroNombre} · ${least.count} multa(s) · total $${least.total}`;
        return NextResponse.json({ intent: 'least_multados', text: textResp, data: [least], actions: [{ label: 'Ver detalles', view: 'multas-asistencias', params: { comuneroId: least.comuneroId } }] });
      }

      const list = top.slice(0, 5);
      const top1 = list[0];
      const textResp = top1
        ? `Más multas: ${top1.comuneroNombre} · ${top1.count} multa(s) · total $${top1.total}`
        : 'No hay multas registradas.';
      return NextResponse.json({ intent: 'top_multados', text: textResp, data: list, actions: [{ label: 'Ver detalles', view: 'multas-asistencias' }] });
    }

    // Ingresos por mes
    const monthNames: Record<string, number> = {
      enero: 1,
      febrero: 2,
      marzo: 3,
      abril: 4,
      mayo: 5,
      junio: 6,
      julio: 7,
      agosto: 8,
      septiembre: 9,
      setiembre: 9,
      octubre: 10,
      noviembre: 11,
      diciembre: 12,
    };

    const mMatch = text.match(/(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|setiembre|octubre|noviembre|diciembre)\s*(?:de\s*(\d{4}))?/i);
    const yMatch = text.match(/(\b\d{4}\b)/);

    if ((intentFromNLU === 'ingresos_mes') || (/(ingresos|ingresó|ingreso|cuanto ingres|cuánto ingres)/.test(text) && /multa/.test(text))) {
      let month = new Date().getMonth() + 1;
      let year = new Date().getFullYear();

      if (entities && entities.month) {
        month = Number(entities.month);
      }
      if (entities && entities.year) {
        year = Number(entities.year);
      }

      if (mMatch) {
        const name = mMatch[1].toLowerCase();
        month = monthNames[name] ?? month;
        if (mMatch[2]) year = Number(mMatch[2]);
      } else if (yMatch && !/(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|setiembre|octubre|noviembre|diciembre)/.test(text)) {
        year = Number(yMatch[1]);
      }

      const suma = getIngresosMes(year, month);
      const textResp = `Ingresos por multas en ${month}/${year}: $${suma}`;
      return NextResponse.json({ intent: 'ingresos_mes', text: textResp, data: { year, month, total: suma }, actions: [{ label: 'Ver reporte', view: 'reportes', params: { tipo: 'multa', year, month } }] });
    }

    // Asistencia: prefer client-side snapshot. Server will return guidance if no snapshot provided.
    if (intentFromNLU === 'asistencia_asamblea' || /(asistieron|asistencia|reunion|reunión|¿cuantas personas|cuántas personas|personas asistieron)/.test(text)) {
      return NextResponse.json({ intent: 'asistencia_asamblea', text: 'Para responder cuántas personas asistieron necesito el registro de asistencia del kiosco (se obtiene desde el dispositivo). Abre el chat desde la interfaz y comparte el snapshot si deseas una respuesta precisa.' });
    }

    // Fallback
    return NextResponse.json({ intent: 'unknown', text: 'No entendí la pregunta. Prueba: "¿Quién tiene más multas?", "¿Cuánto ingresó por multas en julio 2026?" o "¿Cuántas personas asistieron a la última reunión?"' });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request', details: String(err) }, { status: 400 });
  }
}
