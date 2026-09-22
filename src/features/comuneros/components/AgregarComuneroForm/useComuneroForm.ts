import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Comunero, CrearComuneroPayload } from '../../types/types';
import { getNeighborhoods, Neighborhood } from '../../services/neighborhoodsApi';
import {
  comuneroValidationSchema,
  mapaTipoAInglés,
  mapaEstadoCivilAInglés,
  mapaEstadoPersonaAInglés,
} from './comuneroForm.schema';
import { buildInitialFormState, ComuneroFormState } from './ comuneroForm.utils';

interface UseComuneroFormArgs {
  comuneroAEditar?: Comunero | any;
  onGuardar: (
    payload: CrearComuneroPayload,
    fotoFile?: File | Blob | null,
    eliminarFoto?: boolean
  ) => void | Promise<void>;
}

export function useComuneroForm({ comuneroAEditar, onGuardar }: UseComuneroFormArgs) {
  const esEdicion = !!comuneroAEditar;

  const [formData, setFormData] = useState<ComuneroFormState>(() => buildInitialFormState(comuneroAEditar));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [barrios, setBarrios] = useState<Neighborhood[]>([]);
  const [loadingBarrios, setLoadingBarrios] = useState<boolean>(true);

  const fotoInicial = comuneroAEditar?.fotografia ?? comuneroAEditar?.photo ?? null;
  const [fotografia, setFotografia] = useState<string | null>(fotoInicial);
  const [fotoFile, setFotoFile] = useState<File | Blob | null>(null);
  const [fotoEliminada, setFotoEliminada] = useState(false);

  useEffect(() => {
    const fetchBarrios = async () => {
      try {
        setLoadingBarrios(true);
        const data = await getNeighborhoods();
        setBarrios(data);

        // Si es edición y no teníamos el neighborhoodId explícito, intentamos matchear por el nombre del barrio
        if (esEdicion && !formData.neighborhoodId && comuneroAEditar?.vecindario) {
          const match = data.find(
            (b) => b.name.toLowerCase() === String(comuneroAEditar.vecindario).toLowerCase()
          );
          if (match) {
            setFormData((prev) => ({ ...prev, neighborhoodId: match.id }));
          }
        }
      } catch (err) {
        console.error('Error al cargar vecindarios:', err);
      } finally {
        setLoadingBarrios(false);
      }
    };
    fetchBarrios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handlePhotoCaptured = (file: File | Blob, previewUrl: string) => {
    setFotoFile(file);
    setFotografia(previewUrl);
    setFotoEliminada(false);
  };

  const handlePhotoRemoved = () => {
    setFotografia(null);
    setFotoFile(null);
    setFotoEliminada(esEdicion);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Al crear se requiere foto, al ediexistente es válida
    if (!fotoFile && !fotografia && !esEdicion) {
      alert('Debes tomar o subir una fotografía del miembro.');
      return;
    }

    try {
      await comuneroValidationSchema.validate(formData, { abortEarly: false });
      setIsSubmitting(true);

      const payload: CrearComuneroPayload = {
        personType: mapaTipoAInglés[formData.tipoComunero],
        status: mapaEstadoPersonaAInglés[formData.estadoPersona],
        firstName: formData.nombre,
        paternalLastName: formData.apellidoPaterno,
        maternalLastName: formData.apellidoMaterno,
        birthDate: formData.fechaNacimiento,
        maritalStatus: mapaEstadoCivilAInglés[formData.estadoCivil],
        phone: formData.telefono,
        neighborhoodId: formData.neighborhoodId,
        communityMemberSince: formData.communityMemberSince,
        address: formData.address,
      };

      // Se espera el guardado real (puede ser async) antes de liberar el botón,
      // para que "isSubmitting" siga bloqueando mientras dura la petición
      // y así evitar que un doble clic duplique el registro.
      await onGuardar(payload, fotoFile, fotoEliminada);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const validationErrors: Record<string, string> = {};
        err.inner.forEach((error) => {
          if (error.path) validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
      }
      // Si onGuardar (async) lanza un error no manejado, isSubmitting se libera
      // en el finally para no dejar el botón bloqueado permanentemente.
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    esEdicion,
    formData,
    errors,
    isSubmitting,
    barrios,
    loadingBarrios,
    fotografia,
    handleChange,
    handlePhotoCaptured,
    handlePhotoRemoved,
    handleSubmit,
  };
}