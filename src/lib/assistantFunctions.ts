import { multasMock } from '../features/multas-asistencias/mocks/multasMock';
import { ingresosMock } from '../features/reportes/mocks/ingresosMock';

export type AsistenciaSnapshot = {
  reunionActiva: { id: string; nombre: string; fecha: string } | null;
  asistentes: Array<{ id: string; nombre: string }>;
} | null;

export function getTopMultados(limit = 5) {
  const map = new Map<string, { comuneroNombre: string; count: number; total: number }>();

  multasMock.forEach((m) => {
    const existing = map.get(m.comuneroId) ?? { comuneroNombre: m.comuneroNombre, count: 0, total: 0 };
    existing.count += 1;
    existing.total += m.cantidad;
    map.set(m.comuneroId, existing);
  });

  const list = Array.from(map.entries()).map(([comuneroId, v]) => ({ comuneroId, ...v }));
  list.sort((a, b) => b.count - a.count || b.total - a.total);
  return list.slice(0, limit);
}

export function getIngresosMes(year: number, month: number) {
  // month: 1-12
  const sum = ingresosMock
    .filter((i) => i.tipo === 'multa')
    .filter((i) => {
      const d = new Date(i.fecha);
      return d.getFullYear() === year && d.getMonth() + 1 === month;
    })
    .reduce((acc, cur) => acc + (cur.monto ?? 0), 0);

  return sum;
}

export function getAsistenciaAsamblea(snapshot: AsistenciaSnapshot) {
  // Prefer client snapshot if provided
  if (snapshot && snapshot.reunionActiva) {
    return {
      fecha: snapshot.reunionActiva.fecha,
      nombre: snapshot.reunionActiva.nombre,
      asistentes: snapshot.asistentes ?? [],
      source: 'cliente-snapshot',
    };
  }

  // Fallback: infer last asamblea from multasMock (asambleas asociadas a multas)
  const asambleas = multasMock
    .map((m) => m.asamblea)
    .filter(Boolean) as Array<{ id: string; nombre: string; fecha: string }>;

  if (asambleas.length === 0) return { fecha: null, nombre: null, asistentes: [], source: 'none' };

  const last = asambleas
    .slice()
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())[0];

  // Count unique comuneros that reference this asamblea in multasMock
  const asistentes = Array.from(new Set(multasMock.filter((m) => m.asamblea?.id === last.id).map((m) => m.comuneroId))).map((id) => ({ id }));

  return { fecha: last.fecha, nombre: last.nombre, asistentes, source: 'inferred-from-multas' };
}
