import React, { useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  Clipboard,
  Check,
  Wand2,
  Box,
  Settings,
  Tag,
  ArrowLeft,
  FileText,
  ScanBarcode,
  MonitorPlay,
  Factory,
  AlertCircle,
  Eraser,
  Copy,
  Calculator,
  ListTodo,
  Image as ImageIcon,
  Trash2,
  Plus,
  Maximize2,
  RotateCw,
  ZoomIn,
  ZoomOut,
  X,
  Upload,
  Grid,
  FileDown,
  Loader
} from 'lucide-react';

export default function App() {
  // Estado para la navegación
  const [reportType, setReportType] = useState('selection');

  // Referencia para copiar la tabla
  const tableRef = useRef(null);

  // --- ESTADOS PARA IMÁGENES ---
  const [images, setImages] = useState({});
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverSlot, setDragOverSlot] = useState(null);

  // --- ESTADO PARA GENERACIÓN DE PDF ---
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Secciones de fotos configurables
  const [photoSections, setPhotoSections] = useState([
    {
      id: 'group1',
      title: 'Default language & Home screen & Speed dial icon :',
      slots: 9,
      defaultAspect: '9/16'
    },
    {
      id: 'group2',
      title: 'System & About Phone & Device details & Device identifiers & Model & Android version & Regulatory information :',
      slots: 20,
      defaultAspect: '9/16'
    }
  ]);

  // Inicializar slots de imágenes
  useEffect(() => {
    const newImages = { ...images };
    let hasChanges = false;

    photoSections.forEach(section => {
      if (!newImages[section.id]) {
        newImages[section.id] = Array(section.slots).fill(null).map(() => ({
          src: null,
          rotation: 0,
          scale: 1,
          aspectRatio: section.defaultAspect || '16/9',
          label: ''
        }));
        hasChanges = true;
      }
    });

    if (hasChanges) {
      setImages(newImages);
    }
  }, [photoSections]);

  // --- DATOS DEL CHECKLIST ---
  const INITIAL_CHECKLIST = [
    { id: 1, item: 'Comprobación del idioma predeterminado', content: 'Para productos con tarjeta SIM preinsertada...', result: 'PASS' },
    { id: 2, item: 'prueba de encendido CA/CC', content: '1. Verifique si la unidad se enciende correctamente...', result: 'PASS' },
    { id: 3, item: 'Prueba de funcionamiento de la unidad USB', content: '1. Comprobar la unidad extraíble...', result: 'PASS' },
    { id: 4, item: '*Verificación WI 1', content: 'Verificar la función según CFC CQA -Pauta de trabajo', result: '', isHeader: true },
    { id: 5, item: 'Verificación WI 2', content: 'Inserte la tarjeta SIM de prueba y verifique...', result: '', isHeader: true },
    { id: 6, item: 'Bloqueo de subsidio', content: '1. Para teléfonos con función de bloqueo...', result: '3. Carrier SIM : NA' },
    { id: 8, item: 'marcación de emergencia', content: 'En la interfaz de marcación de emergencia...', result: 'PASS' },
    { id: 9, item: 'Prueba de encendido/apagado', content: 'Encender/apagar el teléfono 5 veces', result: 'PASS' },
    { id: 10, item: 'Prueba de encendido/apagado', content: '1. Compruebe la animación y el logotipo...', result: 'PASS' },
    { id: 11, item: '', content: '1. Estado apagado: 1 unidad: Primero, conecte el cargador...', result: 'PASS' },
    { id: 12, item: 'Batería', content: '1. Active o desactive el porcentaje de batería...', result: 'PASS' },
    { id: 13, item: 'Prueba de accesibilidad (Prueba a ciegas)', content: 'Verifique que el modo de accesibilidad...', result: 'PASS' },
    { id: 14, item: 'Valoración y comentarios', content: 'Se puede seleccionar y hacer clic...', result: 'PASS' },
    { id: 15, item: 'Prueba de función de teclas de acceso directo', content: '1. Pulsa la tecla de acceso directo...', result: 'PASS' },
    { id: 16, item: 'Información de ubicación', content: 'La información de ubicación se puede activar...', result: 'PASS' },
    { id: 17, item: 'icono de marcado rápido', content: 'Pulse el icono de la pestaña "Contactos"...', result: 'PASS' },
    { id: 18, item: 'El papel pintado', content: 'Seleccione aleatoriamente tres fondos...', result: 'PASS' },
    { id: 19, item: 'verificación del código nacional', content: 'Marque *#*#78287#*#* en la interfaz...', result: 'PASS' },
    { id: 20, item: '*Prueba de la aplicación de Google', content: 'Consulta la aplicación Google Chrome...', result: 'PASS' },
    { id: 21, item: 'Explora todos los menús durante 1 minuto', content: 'Comprueba si el menú principal se abre...', result: 'PASS' },
    { id: 22, item: 'Especial MOTOROLA', content: 'Acceda a la interfaz principal, haga clic en MOTO APP...', result: 'PASS' },
    { id: 23, item: 'Comprobación de llaves', content: 'Prueba de la tecla de encendido...', result: 'PASS' },
    { id: 24, item: '', content: 'Prueba de la tecla de volumen...', result: 'FAIL' },
    { id: 25, item: 'Comprobación de la cámara', content: 'Selecciona una imagen como fondo de pantalla', result: 'PASS' },
    { id: 26, item: '', content: 'Graba 2 vídeos de 30 segundos cada uno...', result: 'PASS' },
    { id: 27, item: '', content: 'Eliminar fotos y vídeos', result: 'PASS' },
    { id: 28, item: '', content: 'Toma fotos y videos con diferentes configuraciones...', result: 'PASS' },
    { id: 29, item: '', content: 'Cambia entre la cámara trasera y la frontal...', result: 'PASS' },
    { id: 30, item: '', content: 'Toma fotografías en diferentes modos...', result: 'PASS' },
    { id: 31, item: '', content: 'Enciende el flash y toma tres fotos...', result: 'PASS' },
    { id: 32, item: '', content: 'Fotografía macro a 6 cm de distancia...', result: 'PASS' },
    { id: 33, item: 'Prueba de función de la tecla de la cámara', content: '1. Encienda la cámara y utilice las teclas...', result: 'PASS' },
    { id: 34, item: 'Prueba de sonido', content: 'Comprobación de la configuración de sonido...', result: 'PASS' },
    { id: 35, item: '', content: '¿Está activado el sonido de silencio...', result: 'PASS' },
    { id: 36, item: '', content: '1. Se puede configurar y modificar la alarma...', result: 'PASS' },
    { id: 37, item: '', content: 'Comprobación de audio con auriculares...', result: 'PASS' },
    { id: 38, item: '', content: 'Prueba todos los elementos de Voice con headst', result: 'PASS' },
    { id: 39, item: 'Comprobación de TP&LCD', content: '*Para comprobar si la pantalla LCD...', result: 'PASS' },
    { id: 40, item: 'Modificación del brillo', content: 'Modificación del brillo', result: 'PASS' },
    { id: 41, item: 'Comprobación de TPM/LCD (Fuga)', content: '1. Encienda la pantalla y compruebe si hay fugas...', result: 'FAIL' },
    { id: 42, item: 'Prueba ALS', content: 'Cubra la pantalla durante 30 segundos...', result: 'FAIL' },
    { id: 43, item: 'Prueba de función de escritura a mano', content: 'Acceda a la interfaz de entrada...', result: 'PASS' },
    { id: 44, item: 'Comprobación de la configuración de seguridad', content: '1. Configura todos los métodos de bloqueo...', result: 'PASS' },
    { id: 45, item: '', content: 'Configuración de contraseña de patrón', result: 'PASS' },
    { id: 46, item: '', content: 'Configuración del código PIN', result: 'PASS' },
    { id: 47, item: '', content: 'Configuración de Face ID', result: 'PASS' },
    { id: 48, item: '', content: 'Configuración de la contraseña', result: 'PASS' },
    { id: 49, item: 'prueba de red inalámbrica', content: 'Conecta el icono de wifi para comprobar...', result: 'PASS' },
    { id: 50, item: '', content: 'Abre el navegador "Internet Explorer...', result: 'PASS' },
    { id: 51, item: '', content: 'El teléfono puede acceder a la red inalámbrica...', result: 'PASS' },
    { id: 52, item: 'Bluetooth', content: 'Transferir/recibir archivos entre teléfonos...', result: 'PASS' },
    { id: 53, item: 'Configuración del tono de llamada', content: 'Configuración predeterminada del tono...', result: 'PASS' },
    { id: 54, item: 'Ring style', content: 'Configura todos los estilos de tono...', result: 'PASS' },
    { id: 55, item: '', content: 'Explora y escucha todos los tonos preinstalados...', result: 'PASS' },
    { id: 56, item: 'FPS', content: 'Acceda a "Ajustes" → Haga clic en "Seguridad"...', result: 'PASS' },
    { id: 57, item: 'Hora/Fecha', content: 'Configuración de fecha y hora...', result: 'PASS' },
    { id: 58, item: 'Prueba NFC', content: 'Acceda a la prueba NFC y aparecerá el mensaje...', result: 'PASS' },
    { id: 59, item: 'GPS/Google Maps', content: 'Encuentra tu ubicación actual mediante GPS...', result: 'PASS' },
    { id: 60, item: 'De alguna manera, la prueba de pantalla...', content: 'Configurado dentro de la rotación automática...', result: 'PASS' },
    { id: 61, item: 'Modo AirPlane', content: 'Activa el modo AirPlane para comprobar...', result: 'FAIL' },
    { id: 62, item: 'Prueba relacionada con llamadas y auriculares', content: 'Comprueba el historial de llamadas...', result: 'PASS' },
    { id: 63, item: '', content: 'Revisa la lista de llamadas recibidas...', result: 'PASS' },
    { id: 64, item: '', content: 'Realiza la llamada durante al menos 30 segundos...', result: 'PASS' },
    { id: 65, item: 'prueba de llamada manos libres', content: 'prueba de llamada manos libres', result: 'PASS' },
    { id: 66, item: '', content: 'Llame al *611 sin problemas.', result: 'PASS' },
    { id: 67, item: '', content: 'Reciba, recupere y finalice la llamada...', result: 'PASS' },
    { id: 68, item: '', content: 'La agenda telefónica se puede configurar...', result: 'PASS' },
    { id: 69, item: '', content: 'Rellene todos los campos durante la configuración...', result: 'PASS' },
    { id: 70, item: '', content: 'Verifique si tanto el ID de la agenda...', result: 'PASS' },
    { id: 71, item: '', content: 'Configura la agenda telefónica con 3 números...', result: 'PASS' },
    { id: 72, item: '', content: 'El bloqueo o desbloqueo manual puede activar...', result: 'PASS' },
    { id: 73, item: '', content: 'Establece una llamada entre el teléfono móvil A...', result: 'PASS' },
    { id: 74, item: 'Llamada telefónica (usando auriculares Bluetooth)', content: 'Prueba de emparejamiento de auriculares Bluetooth', result: '' },
    { id: 75, item: '', content: 'Prueba del tono de llamada entrante', result: '' },
    { id: 76, item: '', content: 'Prueba de recepción de llamadas...', result: '' },
    { id: 77, item: '', content: 'Prueba de marcación de llamadas...', result: '' },
    { id: 78, item: '', content: 'Prueba de colgar llamadas', result: '' },
    { id: 79, item: 'Prueba de contacto visual...', content: 'Prueba de videollamada y llamada de red...', result: 'PASS' },
    { id: 80, item: 'Correo electrónico', content: 'Se puede acceder a la aplicación de correo...', result: 'PASS' },
    { id: 81, item: 'Almacenamiento en tarjeta SD', content: 'Compruebe el almacenamiento de la tarjeta SD...', result: 'NA' },
    { id: 82, item: 'WEB', content: 'Inicia sesión en una página web aleatoria...', result: 'PASS' },
    { id: 83, item: '', content: 'Entra en la web de Random, busca imágenes...', result: 'PASS' },
    { id: 84, item: 'Prueba de dirección Bluetooth y Wi-Fi', content: '1. UI/DB: En el teléfono, vaya a Ajustes...', result: 'PASS' },
    { id: 85, item: 'PRUEBA CQA', content: 'En la interfaz de marcación telefónica, introduzca...', result: 'PASS' },
    { id: 86, item: 'Versión SW', content: 'Confirme si la versión del software es la misma...', result: 'PASS' },
    { id: 87, item: 'Configuración de red', content: '1. Confirma la red SIM, por ejemplo, 4G...', result: 'PASS' },
    { id: 88, item: 'Confirmar el proceso de recuperación', content: 'Recupera el teléfono normalmente...', result: 'PASS' }
  ];

  // Estado unificado del formulario
  const [formData, setFormData] = useState({
    line: '', model: '', workOrder: '', date: new Date().toISOString().split('T')[0],
    inspector: '', shift: 'A', boxNumber: '', country: 'ARG',
    cfcTopEngineer: '', shipMarket: '', xcvrNo: '', salesModel: '',
    swVersion1FF: '', fileName1FF: '', swKit: '', tacVerify: '',
    simCardLock: 'SI', memoryCard: 'NO', cfcSwnRef: 'N/A', powerUpMessage: 'N/A', smv: 'N/A', testSystemReady: 'N/A',
    bluetooth: 'SI', labelCodification: 'N/A', flashingWiUpdate: 'SI', numUsimCards: '1', subsidyLock: 'NO', customerBackSwReady: 'N/A',
    hardwareSku: '', swVersionQa: 'NA', bpVersion: '', fccId: '', btAddress: '', wifiAddress: '', buildNumber: '',
    totalRom: '', usedRom: '', ramStorage: '', frontHousingColor: '', imeiCheck: '', qaStatus: 'PASS', simLockQa: 'NA', iccid: 'NA', sdStorageQa: 'NO',
    programName: '',
    checklistValues: INITIAL_CHECKLIST.reduce((acc, item) => ({ ...acc, [item.id]: item.result }), {}),
    labelPartNumber: ''
  });

  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const upperFields = ['line', 'model', 'workOrder', 'xcvrNo', 'salesModel', 'swKit', 'cfcTopEngineer', 'labelPartNumber', 'hardwareSku', 'fccId', 'iccid', 'programName'];

    if (upperFields.includes(name)) {
      setFormData(prev => ({ ...prev, [name]: value.toUpperCase() }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleReset = () => {
    if (window.confirm("¿Estás seguro de limpiar todo el formulario?")) {
      setFormData(prev => ({
        ...prev,
        cfcTopEngineer: '', xcvrNo: '', salesModel: '', swVersion1FF: '', swKit: '', fileName1FF: '', tacVerify: '',
        hardwareSku: '', bpVersion: '', fccId: '', btAddress: '', wifiAddress: '', buildNumber: '', totalRom: '', usedRom: '', imeiCheck: '',
        programName: '', shipMarket: ''
      }));
      setImages({});
    }
  };

  const calculateAvailableRom = () => {
    const total = parseFloat(formData.totalRom);
    const used = parseFloat(formData.usedRom);
    if (!isNaN(total) && !isNaN(used)) {
      return `${total - used}GB`;
    }
    return 'N/A';
  };

  const handleDownloadPdf = () => {
    const input = document.getElementById('printable-section');
    if (!input) {
      alert("Error: No se encontró el elemento para exportar a PDF.");
      return;
    }

    setIsGeneratingPdf(true);

    const scale = 3; // Escala 3 mejorada para mayor nitidez al hacer zoom

    html2canvas(input, {
      scale: scale,
      useCORS: true,
      logging: false,
      onclone: (doc) => {
        const ignoredElements = doc.querySelectorAll('[data-html2canvas-ignore="true"]');
        ignoredElements.forEach(el => el.style.display = 'none');
      }
    }).then(canvas => {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      const ratio = canvasWidth / pdfWidth;
      const pageHeightInCanvasPixels = pdfHeight * ratio;

      let currentY = 0;

      // Mapeo de zonas protegidas (evitar cortes en estos elementos)
      const rect = input.getBoundingClientRect();
      // Incluimos tr, headers de sección y contenedores de imágenes en la protección
      const protectElements = input.querySelectorAll('tr, .avoid-break, .header-section, .info-section');
      const protectedZones = [];

      protectElements.forEach(el => {
        const elRect = el.getBoundingClientRect();
        // Convertir coordenadas del DOM a coordenadas del Canvas escalado
        const top = (elRect.top - rect.top) * scale;
        const bottom = (elRect.bottom - rect.top) * scale;
        protectedZones.push({ top, bottom });
      });

      const isSafeToCut = (y) => {
        // Margen de seguridad (ej. 5px) para no cortar justo en el borde
        const safetyMargin = 5 * scale;
        for (const zone of protectedZones) {
          if (y > (zone.top + safetyMargin) && y < (zone.bottom - safetyMargin)) {
            return false;
          }
        }
        return true;
      };

      const findSafeCutY = (targetY) => {
        // Buscar hacia arriba un punto de corte seguro hasta 1/3 de la página
        const limit = targetY - (pageHeightInCanvasPixels * 0.33);
        let testY = targetY;
        const step = 10;

        while (testY > limit) {
          if (isSafeToCut(testY)) {
            return testY;
          }
          testY -= step;
        }
        return targetY; // Si no encuentra, corta donde caiga
      };

      while (currentY < canvasHeight) {
        let sliceHeight = pageHeightInCanvasPixels;

        if (currentY + sliceHeight >= canvasHeight) {
          sliceHeight = canvasHeight - currentY;
        } else {
          const targetCut = currentY + sliceHeight;
          const safeCut = findSafeCutY(targetCut);
          sliceHeight = safeCut - currentY;
        }

        const sCanvas = document.createElement('canvas');
        sCanvas.width = canvasWidth;
        sCanvas.height = sliceHeight;
        const sCtx = sCanvas.getContext('2d');

        sCtx.drawImage(
          canvas,
          0, currentY, canvasWidth, sliceHeight,
          0, 0, canvasWidth, sliceHeight
        );

        const sliceImgData = sCanvas.toDataURL('image/jpeg', 0.95);
        const pdfSliceHeight = sliceHeight / ratio;

        if (currentY > 0) pdf.addPage();

        pdf.addImage(sliceImgData, 'JPEG', 0, 0, pdfWidth, pdfSliceHeight);

        currentY += sliceHeight;
      }

      const dateStr = new Date().toISOString().split('T')[0];
      const fileName = `Reporte_${formData.salesModel || 'BoxOpening'}_${dateStr}.pdf`;
      pdf.save(fileName);

      setIsGeneratingPdf(false);
    }).catch(err => {
      console.error("Error al generar PDF:", err);
      alert("Hubo un error al generar el PDF. Revisa la consola para más detalles.");
      setIsGeneratingPdf(false);
    });
  };

  // --- HANDLERS DE IMÁGENES ---
  const handleImageUpload = (sectionId, index, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const isHorizontal = img.width > img.height;
          const detectedAspectRatio = isHorizontal ? '16/9' : '9/16';

          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const maxWidth = isHorizontal ? 2560 : 1440;
          const maxHeight = isHorizontal ? 1440 : 2560;

          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = width * ratio;
            height = height * ratio;
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          const compressedSrc = canvas.toDataURL('image/jpeg', 0.90);

          setImages(prev => ({
            ...prev,
            [sectionId]: prev[sectionId].map((imgData, i) =>
              i === index ? {
                ...imgData,
                src: compressedSrc,
                aspectRatio: detectedAspectRatio
              } : imgData
            )
          }));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = (sectionId, index) => {
    setImages(prev => ({
      ...prev,
      [sectionId]: prev[sectionId].map((img, i) =>
        i === index ? { src: null, rotation: 0, scale: 1, aspectRatio: '9/16', label: '' } : img
      )
    }));
    setSelectedSlot(null);
  };

  const handleRotate = (sectionId, index) => {
    setImages(prev => ({
      ...prev,
      [sectionId]: prev[sectionId].map((img, i) =>
        i === index ? { ...img, rotation: (img.rotation + 90) % 360 } : img
      )
    }));
  };

  const handleZoom = (sectionId, index, direction) => {
    setImages(prev => ({
      ...prev,
      [sectionId]: prev[sectionId].map((img, i) =>
        i === index ? {
          ...img,
          scale: direction === 'in' ? Math.min(img.scale + 0.2, 3) : Math.max(img.scale - 0.2, 0.5)
        } : img
      )
    }));
  };

  const toggleAspectRatio = (sectionId, index) => {
    setImages(prev => ({
      ...prev,
      [sectionId]: prev[sectionId].map((img, i) =>
        i === index ? {
          ...img,
          aspectRatio: img.aspectRatio === '9/16' ? '16/9' : '9/16'
        } : img
      )
    }));
  };

  const handleDragStart = (e, sectionId, index) => {
    setDraggedItem({ sectionId, index });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, sectionId, index) => {
    e.preventDefault();
    setDragOverSlot({ sectionId, index });
  };

  const handleDrop = (e, targetSection, targetIndex) => {
    e.preventDefault();
    setDragOverSlot(null);
    if (!draggedItem) return;

    const { sectionId: sourceSection, index: sourceIndex } = draggedItem;

    setImages(prev => {
      const newImages = { ...prev };
      const sourceImg = newImages[sourceSection][sourceIndex];
      const targetImg = newImages[targetSection][targetIndex];

      newImages[sourceSection] = [...newImages[sourceSection]];
      newImages[sourceSection][sourceIndex] = targetImg;

      newImages[targetSection] = [...newImages[targetSection]];
      newImages[targetSection][targetIndex] = sourceImg;

      return newImages;
    });
    setDraggedItem(null);
  };

  const renderImageSlot = (sectionId, index) => {
    const sectionImages = images[sectionId] || [];
    const image = sectionImages[index];
    if (!image) return null;

    const isSelected = selectedSlot?.section === sectionId && selectedSlot?.index === index;
    const isDragOver = dragOverSlot?.sectionId === sectionId && dragOverSlot?.index === index;

    return (
      <div
        key={`${sectionId}-${index}`}
        draggable
        onDragStart={(e) => handleDragStart(e, sectionId, index)}
        onDragOver={(e) => handleDragOver(e, sectionId, index)}
        onDrop={(e) => handleDrop(e, sectionId, index)}
        onDragLeave={() => setDragOverSlot(null)}
        className={`
                relative bg-white border-2 rounded-lg overflow-hidden transition-all duration-200 group
                ${image.src ? (isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-slate-300') : 'border-dashed border-slate-300 hover:border-blue-400'}
                ${isDragOver ? 'border-green-500 bg-green-50 ring-2 ring-green-200' : ''}
            `}
        style={{ aspectRatio: image.aspectRatio || '9/16' }}
        onClick={() => image.src && setSelectedSlot({ section: sectionId, index })}
      >
        {!image.src ? (
          <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-slate-50">
            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(sectionId, index, e)} />
            <Upload className="w-8 h-8 text-slate-300 mb-2 group-hover:text-blue-400 transition-colors" />
            <span className="text-xs text-slate-400 group-hover:text-blue-500">Subir Foto</span>
          </label>
        ) : (
          <>
            <div className="w-full h-full flex items-center justify-center bg-slate-100 overflow-hidden">
              <img
                src={image.src}
                alt="evidence"
                className="max-w-full max-h-full object-contain transition-transform duration-300"
                style={{ transform: `rotate(${image.rotation}deg) scale(${image.scale})` }}
              />
            </div>
            <div className={`no-print absolute top-2 right-2 flex flex-col gap-1 z-10 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`} data-html2canvas-ignore="true">
              <div className="bg-white/90 backdrop-blur rounded shadow-sm border border-slate-200 p-1 flex flex-col gap-1">
                <button onClick={(e) => { e.stopPropagation(); toggleAspectRatio(sectionId, index); }} className="p-1.5 hover:bg-slate-100 rounded text-slate-600" title="Cambiar Aspecto"><Maximize2 className="w-4 h-4" /></button>
                <button onClick={(e) => { e.stopPropagation(); handleRotate(sectionId, index); }} className="p-1.5 hover:bg-slate-100 rounded text-slate-600" title="Rotar"><RotateCw className="w-4 h-4" /></button>
                <button onClick={(e) => { e.stopPropagation(); handleZoom(sectionId, index, 'in'); }} className="p-1.5 hover:bg-slate-100 rounded text-slate-600" title="Zoom +"><ZoomIn className="w-4 h-4" /></button>
                <button onClick={(e) => { e.stopPropagation(); handleZoom(sectionId, index, 'out'); }} className="p-1.5 hover:bg-slate-100 rounded text-slate-600" title="Zoom -"><ZoomOut className="w-4 h-4" /></button>
                <div className="h-px bg-slate-200 my-0.5"></div>
                <button onClick={(e) => { e.stopPropagation(); handleDeleteImage(sectionId, index); }} className="p-1.5 hover:bg-red-50 rounded text-red-500" title="Eliminar"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  // 1. PANTALLA DE SELECCIÓN
  if (reportType === 'selection') {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center font-sans text-slate-800">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-slate-800 mb-2 flex justify-center items-center gap-3">
              <Box className="w-10 h-10 text-blue-600" /> Box Opening Generator
            </h1>
            <p className="text-slate-500 text-lg">Seleccione el tipo de reporte a realizar</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
            <button onClick={() => setReportType('software')} className="group relative bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl border-2 border-transparent hover:border-blue-500 transition-all duration-300 text-left">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Settings className="w-32 h-32 text-blue-600" /></div>
              <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><MonitorPlay className="w-8 h-8 text-blue-600" /></div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Build of Two Form</h2>
              <p className="text-slate-500">Completo: Ing + QA + Checklist</p>
            </button>
            <button onClick={() => setReportType('label')} className="group relative bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl border-2 border-transparent hover:border-purple-500 transition-all duration-300 text-left">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Tag className="w-32 h-32 text-purple-600" /></div>
              <div className="bg-purple-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><ScanBarcode className="w-8 h-8 text-purple-600" /></div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Label Inspection</h2>
              <p className="text-slate-500">Auditoría de etiquetas.</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const ThemeIcon = reportType === 'software' ? MonitorPlay : ScanBarcode;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 font-sans text-slate-800">

      {/* Conservamos los estilos de impresión por si se usan en otro lugar, pero la lógica principal ahora es la descarga */}
      <style>{`
        @media print {
          /* Estilos de impresión (opcional, ya que el botón principal ahora descarga) */
        }
      `}</style>

      <div className="max-w-[1600px] mx-auto">

        {/* HEADER DE NAVEGACIÓN */}
        <div className="flex items-center justify-between mb-6 no-print">
          <button onClick={() => setReportType('selection')} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-white">
            <ArrowLeft className="w-5 h-5" /> Volver al Inicio
          </button>
          <div className="flex gap-2">
            <button onClick={handleReset} className="flex items-center gap-2 text-red-500 hover:text-red-700 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium">
              <Eraser className="w-4 h-4" /> Limpiar Datos
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* COLUMNA IZQUIERDA: FORMULARIO */}
          <div className="lg:col-span-4 space-y-6 h-fit overflow-y-auto max-h-[calc(100vh-100px)] pr-2 custom-scrollbar no-print">
            {/* HEADER INFO */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2"><Factory className="w-4 h-4" /> Header Info</h3>
              <div className="space-y-3">
                <div><label className="block text-xs font-bold text-slate-600 mb-1">Product Name (Model)</label><input type="text" name="model" value={formData.model} onChange={handleChange} className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-sm uppercase" placeholder="PHN MOTO..." /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-xs font-bold text-slate-600 mb-1">Country</label><input type="text" name="country" value={formData.country} onChange={handleChange} className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-sm uppercase" /></div>
                  <div><label className="block text-xs font-bold text-slate-600 mb-1">Date</label><input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-sm" /></div>
                </div>
                <div><label className="block text-xs font-bold text-slate-600 mb-1">Inspector Name</label><input type="text" name="inspector" value={formData.inspector} onChange={handleChange} className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-sm" /></div>
              </div>
            </div>

            {/* SECCIÓN ESPECÍFICA */}
            <div className={`bg-white p-5 rounded-xl shadow-lg border-l-4 ${reportType === 'software' ? 'border-l-blue-500' : 'border-l-purple-500'}`}>
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100"><ThemeIcon className={`w-5 h-5 ${reportType === 'software' ? 'text-blue-600' : 'text-purple-600'}`} /><h2 className="text-lg font-bold text-slate-800">{reportType === 'software' ? 'Build of Two Data' : 'Label Data'}</h2></div>

              {/* FORMULARIO SOFTWARE */}
              {reportType === 'software' && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-blue-600 bg-blue-50 p-2 rounded uppercase">Página 1: Ingeniería</div>
                    <div className="space-y-2">
                      <input type="text" name="cfcTopEngineer" value={formData.cfcTopEngineer} onChange={handleChange} placeholder="TrackID" className="w-full p-2 border rounded text-sm uppercase" />
                      <input type="text" name="shipMarket" value={formData.shipMarket} onChange={handleChange} placeholder="Ship Market" className="w-full p-2 border rounded text-sm" />
                      <input type="text" name="xcvrNo" value={formData.xcvrNo} onChange={handleChange} placeholder="XCVR No." className="w-full p-2 border rounded text-sm uppercase" />
                      <input type="text" name="salesModel" value={formData.salesModel} onChange={handleChange} placeholder="Sales Model" className="w-full p-2 border rounded text-sm uppercase" />
                      <input type="text" name="swVersion1FF" value={formData.swVersion1FF} onChange={handleChange} placeholder="S/W Version 1FF" className="w-full p-2 border rounded text-sm" />
                      <input type="text" name="fileName1FF" value={formData.fileName1FF} onChange={handleChange} placeholder="1FF File Name" className="w-full p-2 border rounded text-sm" />
                    </div>
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <input type="text" name="swKit" value={formData.swKit} onChange={handleChange} placeholder="S/W Kit" className="w-full p-2 border rounded text-sm uppercase" />
                      <input type="text" name="tacVerify" value={formData.tacVerify} onChange={handleChange} placeholder="TAC Verify" className="w-full p-2 border rounded text-sm" />
                    </div>
                  </div>
                  <div className="space-y-3 pt-4 border-t-2 border-slate-200">
                    <div className="text-xs font-bold text-blue-600 bg-blue-50 p-2 rounded uppercase flex justify-between items-center"><span>Página 2: QA Check</span><Calculator className="w-3 h-3" /></div>
                    <div className="space-y-2">
                      <input type="text" name="hardwareSku" value={formData.hardwareSku} onChange={handleChange} placeholder="Hardware SKU" className="w-full p-2 border rounded text-sm uppercase" />
                      <input type="text" name="bpVersion" value={formData.bpVersion} onChange={handleChange} placeholder="BP Version" className="w-full p-2 border rounded text-sm" />
                      <input type="text" name="fccId" value={formData.fccId} onChange={handleChange} placeholder="FCC ID" className="w-full p-2 border rounded text-sm uppercase" />
                      <input type="text" name="buildNumber" value={formData.buildNumber} onChange={handleChange} placeholder="Build Number" className="w-full p-2 border rounded text-sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" name="btAddress" value={formData.btAddress} onChange={handleChange} placeholder="BT" className="w-full p-2 border rounded text-sm" />
                      <input type="text" name="wifiAddress" value={formData.wifiAddress} onChange={handleChange} placeholder="WIFI" className="w-full p-2 border rounded text-sm" />
                    </div>
                    <div className="bg-slate-50 p-2 rounded border border-slate-200">
                      <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Storage</label>
                      <div className="grid grid-cols-3 gap-2 items-center">
                        <input type="number" name="totalRom" value={formData.totalRom} onChange={handleChange} placeholder="Total" className="w-full p-1 border rounded text-sm text-center" />
                        <div className="text-center font-bold text-slate-400">-</div>
                        <input type="number" name="usedRom" value={formData.usedRom} onChange={handleChange} placeholder="Used" className="w-full p-1 border rounded text-sm text-center" />
                      </div>
                      <div className="mt-2 text-center text-xs font-bold text-blue-600 bg-blue-100 rounded py-1">Available: {calculateAvailableRom()}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" name="ramStorage" value={formData.ramStorage} onChange={handleChange} placeholder="RAM" className="w-full p-2 border rounded text-sm" />
                      <input type="text" name="frontHousingColor" value={formData.frontHousingColor} onChange={handleChange} placeholder="Color Housing" className="w-full p-2 border rounded text-sm" />
                    </div>
                    <input type="text" name="imeiCheck" value={formData.imeiCheck} onChange={handleChange} placeholder="IMEI Check" className="w-full p-2 border rounded text-sm" />
                  </div>
                  <div className="space-y-3 pt-4 border-t-2 border-slate-200">
                    <div className="text-xs font-bold text-blue-600 bg-blue-50 p-2 rounded uppercase flex justify-between items-center"><span>Página 3: Checklist</span><ListTodo className="w-3 h-3" /></div>
                    <div><label className="text-xs font-bold text-slate-500 uppercase">Producto / Program Name</label><input type="text" name="programName" value={formData.programName} onChange={handleChange} placeholder="Ej: EQUATOR" className="w-full p-2 border rounded text-sm uppercase" /></div>
                  </div>
                  <div className="space-y-3 pt-4 border-t-2 border-slate-200">
                    <div className="text-xs font-bold text-blue-600 bg-blue-50 p-2 rounded uppercase flex justify-between items-center"><span>Página 4: Fotos</span><ImageIcon className="w-3 h-3" /></div>
                    <div className="space-y-4">
                      {photoSections.map(section => (
                        <div key={section.id} className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                          <div className="text-xs font-bold text-slate-600 uppercase mb-2 flex items-center gap-2 leading-tight"><Grid className="w-3 h-3 flex-shrink-0" />{section.title}</div>
                          <div className="grid grid-cols-3 gap-2">
                            {images[section.id] && images[section.id].map((_, idx) => (
                              <div key={idx} className="aspect-[9/16]">{renderImageSlot(section.id, idx)}</div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* FORMULARIO LABEL */}
              {reportType === 'label' && (
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 text-yellow-800 text-sm rounded border border-yellow-200">🚧 Funcionalidad de Labels pendiente de rediseño visual.</div>
                  <input type="text" name="labelPartNumber" value={formData.labelPartNumber} onChange={handleChange} className="w-full p-3 border border-slate-200 rounded-lg outline-none uppercase" placeholder="P/N..." />
                </div>
              )}
            </div>
          </div>

          {/* COLUMNA DERECHA: PREVIEW */}
          <div className="lg:col-span-8 print-content">
            <div className="sticky top-6 no-print">
              <div className="bg-slate-800 text-white p-3 rounded-t-xl flex items-center justify-between shadow-lg">
                <h2 className="font-bold flex items-center gap-2 text-sm"><FileText className="w-4 h-4" /> Vista Previa del Reporte</h2>
                <button
                  onClick={handleDownloadPdf}
                  disabled={isGeneratingPdf}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded text-xs font-bold flex items-center gap-2 transition-colors shadow-md border border-blue-400 disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  {isGeneratingPdf ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Generando...
                    </>
                  ) : (
                    <>
                      <FileDown className="w-4 h-4" />
                      Descargar PDF
                    </>
                  )}
                </button>
              </div>

              <div className="bg-white border-x border-b border-slate-200 p-6 rounded-b-xl shadow-2xl overflow-auto h-[calc(100vh-150px)]">
                {reportType === 'software' ? (
                  <div className="min-w-[700px] bg-white" ref={tableRef} id="printable-section">

                    <div className="text-left font-bold text-sm mb-2 pl-1 font-sans">{formData.salesModel}{formData.xcvrNo ? `(${formData.xcvrNo})` : ''}</div>
                    <div className="text-center mb-1"><h1 className="text-xl font-bold uppercase underline decoration-2 underline-offset-4">BUILD OF TWO FORM</h1></div>

                    <div className="border border-black text-sm">
                      <div className="flex border-b border-black">
                        <div className="w-1/3 border-r border-black p-1 font-bold flex items-center">Build Of Two Type:</div>
                        <div className="w-2/3 p-1 flex justify-around items-center"><span>Phone submit &nbsp; <b>VERDADERO</b></span><span>Paper submit &nbsp; FALSO</span></div>
                      </div>
                      <div className="flex border-b border-black">
                        <div className="w-32 border-r border-black p-1 font-bold bg-white flex items-center">Product:</div>
                        <div className="flex-1 p-1 uppercase flex items-center justify-center">{formData.model}</div>
                      </div>
                      <div className="flex">
                        <div className="w-32 border-r border-black p-1 font-bold flex items-center">Country:</div>
                        <div className="w-48 border-r border-black p-1 uppercase flex items-center justify-center">{formData.country}</div>
                        <div className="flex-1 text-right p-1 font-bold pr-2 flex items-center justify-end">Name /Date:</div>
                        <div className="w-32 border-l border-black p-1 text-center flex items-center justify-center">{formData.date} / {formData.inspector}</div>
                      </div>
                    </div>

                    <div className="bg-[#5B9BD5] text-white font-bold text-center p-1 border-x border-b border-black text-sm mt-2">En la siguiente área requieren que los ingenieros los completen.</div>
                    <table className="w-full border-collapse border border-black text-sm">
                      <thead><tr className="bg-[#DEEBF7]"><th className="border border-black p-1 w-1/3 text-center">Items</th><th className="border border-black p-1 w-1/3 text-center">Contenido</th><th className="border border-black p-1 w-1/3 text-center">Datos</th></tr></thead>
                      <tbody className="text-center">
                        {[
                          { label: 'CFC TOP Engineer:', val: formData.cfcTopEngineer, hasInput: true },
                          { label: 'Ship market:', val: formData.shipMarket },
                          { label: 'XCVR No.:', val: formData.xcvrNo },
                          { label: 'S/M - Sales Model:', val: formData.salesModel },
                          { label: 'CFC s/w reference No.', val: formData.cfcSwnRef },
                          { label: 'S/W version in 1FF file', val: formData.swVersion1FF },
                          { label: 'Power-Up Message:', val: formData.powerUpMessage },
                          { label: 'S/W kit', val: formData.swKit },
                          { label: 'SMV', val: formData.smv },
                          { label: '1FF file name', val: formData.fileName1FF },
                          { label: 'Test system ready confirmed', val: formData.testSystemReady },
                          { label: 'Bluetooth', val: formData.bluetooth },
                          { label: 'Label Codification', val: formData.labelCodification },
                          { label: 'Flashing WI update', val: formData.flashingWiUpdate },
                          { label: 'Number of UISM Card(s)', val: formData.numUsimCards },
                          { label: 'Subsidy Lock? (SEA tick)', val: formData.subsidyLock },
                          { label: 'SIM Card Lock? (SEA tick)', val: formData.simCardLock },
                          { label: 'Memory Card/SD card', val: formData.memoryCard },
                          { label: 'TAC (range) verify on phone', val: formData.tacVerify ? `TAC (range): ${formData.tacVerify}` : '' },
                          { label: 'Customer back SW ready? (Y/N)', val: formData.customerBackSwReady },
                        ].map((row, idx) => (
                          <tr key={idx} className="bg-white"><td className="border border-black p-1 font-medium text-right pr-4 whitespace-nowrap align-middle">{row.label}</td><td className="border border-black p-1 text-center font-bold text-slate-700 align-middle">{row.val}</td><td className="border border-black p-1 relative align-middle">{row.hasInput && <div className="w-full h-6 border-2 border-green-600 rounded-sm"></div>}</td></tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="bg-[#5B9BD5] text-white font-bold text-center p-1 border-x border-b border-black text-sm mt-0">En la siguiente área requieren que el personal de QA lo completen.</div>
                    <table className="w-full border-collapse border border-black text-sm">
                      <thead><tr className="bg-[#DEEBF7]"><th className="border border-black p-1 w-1/3 text-center">Items</th><th className="border border-black p-1 w-1/3 text-center">Contenido</th><th className="border border-black p-1 w-1/3 text-center">Datos</th></tr></thead>
                      <tbody className="text-center">
                        {[
                          { label: 'CFC CQA:', val: formData.cfcTopEngineer },
                          { label: 'Hardware SKU:', val: formData.hardwareSku },
                          { label: 'Ship Market:', val: formData.shipMarket },
                          { label: 'S/W version:', val: formData.swVersionQa },
                          { label: 'BP version:', val: formData.bpVersion },
                          { label: 'FCC ID:', val: formData.fccId },
                          { label: 'BT Address:', val: formData.btAddress },
                          { label: 'WIFI Address:', val: formData.wifiAddress },
                          { label: 'Build number :', val: formData.buildNumber },
                          { label: 'SVN kit :', val: formData.swKit },
                          { label: 'XCVR No. :', val: formData.xcvrNo },
                          { label: 'SIM Lock? (SEs tick "Yes" or"No") :', val: formData.simLockQa },
                          { label: 'Memory Card/SD card needed:', val: formData.memoryCard },
                          { label: 'ICCID :', val: formData.iccid },
                          { label: 'Total ROM :', val: formData.totalRom ? `${formData.totalRom}GB` : '' },
                          { label: 'Used ROM :', val: formData.usedRom ? `${formData.usedRom}GB` : '' },
                          { label: 'Available ROM :', val: calculateAvailableRom() },
                          { label: 'Ram storage :', val: formData.ramStorage },
                          { label: 'SD Storage :', val: formData.sdStorageQa },
                          { label: 'Front Housing Color:', val: formData.frontHousingColor },
                          { label: 'Default Language :', val: 'N/A' /*formData.defaultLanguage*/ },
                          { label: 'IMEI Check:', val: formData.imeiCheck },
                          { label: 'IMEI (range) verify result:', val: formData.tacVerify },
                          { label: 'Estado', val: formData.qaStatus },
                        ].map((row, idx) => (
                          <tr key={`qa-${idx}`} className="bg-white"><td className="border border-black p-1 font-medium text-right pr-4 whitespace-nowrap align-middle">{row.label}</td><td className="border border-black p-1 text-center font-bold text-slate-700 align-middle"></td><td className="border border-black p-1 font-bold text-slate-800 text-center align-middle">{row.val}</td></tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="mt-8 page-break-before">
                      <div className="text-center mb-1"><h1 className="text-xl font-bold uppercase underline decoration-2 underline-offset-4">BUILD OF TWO CHECKLIST</h1></div>
                      <div className="border border-black text-sm bg-[#FFF2CC] avoid-break">
                        <div className="flex">
                          <div className="w-32 border-r border-black p-1 font-bold flex items-center">Product</div>
                          <div className="w-1/3 border-r border-black p-1 uppercase flex items-center justify-center">{formData.programName}</div>
                          <div className="flex-1"></div>
                          <div className="w-16 border-l border-black p-1 font-bold flex items-center justify-center">S/M</div>
                          <div className="w-32 border-l border-black p-1 uppercase flex items-center justify-center">{formData.salesModel}</div>
                        </div>
                        <div className="flex border-t border-black">
                          <div className="w-32 border-r border-black p-1 font-bold flex items-center">Country</div>
                          <div className="w-1/3 border-r border-black p-1 uppercase flex items-center justify-center">{formData.country}</div>
                          <div className="flex-1"></div>
                          <div className="w-16 border-l border-black p-1 font-bold flex items-center justify-center">Date</div>
                          <div className="w-32 border-l border-black p-1 flex items-center justify-center">{formData.date}</div>
                        </div>
                        <div className="flex border-t border-black justify-end"><div className="p-1 uppercase font-bold mr-2">{formData.cfcTopEngineer}</div></div>
                      </div>
                      <table className="w-full border-collapse border border-black text-xs mt-2">
                        <thead><tr className="bg-[#FFF2CC]"><th className="border border-black p-1 w-8">No.</th><th className="border border-black p-1 w-48">Chequear Items</th><th className="border border-black p-1">Chequear Contenido</th><th className="border border-black p-1 w-24">Resultado</th></tr></thead>
                        <tbody>
                          {INITIAL_CHECKLIST.map((row) => (
                            <tr key={row.id} className={row.isHeader ? 'bg-yellow-200' : 'bg-white'}><td className="border border-black p-1 text-center align-middle">{row.id}</td><td className="border border-black p-1 font-medium align-middle">{row.item}</td><td className="border border-black p-1 align-middle">{row.content}</td><td className={`border border-black p-1 text-center font-bold align-middle ${formData.checklistValues[row.id] === 'FAIL' ? 'text-red-600' : 'text-slate-800'}`}>{formData.checklistValues[row.id]}</td></tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-8 page-break-before">
                      <div className="text-center mb-1"><h1 className="text-xl font-bold uppercase underline decoration-2 underline-offset-4">EVIDENCIA FOTOGRÁFICA</h1></div>
                      <div className="border border-black text-sm bg-white mb-2 avoid-break">
                        <div className="flex border-b border-black">
                          <div className="w-24 border-r border-black p-1 font-bold flex items-center">Country</div><div className="w-32 border-r border-black p-1 uppercase flex items-center justify-center">{formData.country}</div>
                          <div className="w-24 border-r border-black p-1 font-bold flex items-center">SVN KIT#</div><div className="flex-1 border-r border-black p-1 uppercase flex items-center justify-center">{formData.swKit}</div>
                          <div className="w-16 border-r border-black p-1 font-bold flex items-center">S/M</div><div className="w-32 border-r border-black p-1 uppercase flex items-center justify-center">{formData.salesModel}</div>
                          <div className="w-16 border-r border-black p-1 font-bold flex items-center">Date</div><div className="w-24 p-1 flex items-center justify-center">{formData.date}</div>
                        </div>
                      </div>
                      {photoSections.map((section) => (
                        <div key={section.id} className="mt-4">
                          <div className="bg-[#5B9BD5] text-white font-bold p-1 border border-black text-sm">{section.title}</div>
                          <div className={`grid ${section.id === 'group2' ? 'grid-cols-2' : 'grid-cols-5'} gap-1 border-x border-b border-black p-1`}>
                            {images[section.id] && images[section.id].map((img, idx) => (
                              img.src && (
                                <div key={idx} className="flex flex-col items-center border border-slate-300 p-0.5 avoid-break">
                                  <div className={`relative w-full ${section.id === 'group2' ? 'h-96' : 'h-40'} overflow-hidden bg-slate-100 flex items-center justify-center`}><img src={img.src} className="max-w-full max-h-full object-contain" style={{ transform: `rotate(${img.rotation}deg) scale(${img.scale})` }} alt={`Evidence ${idx}`} /></div>
                                </div>
                              )
                            ))}
                            {(!images[section.id] || images[section.id].every(img => !img.src)) && <div className={`text-center text-xs text-slate-400 italic py-4 ${section.id === 'group2' ? 'col-span-2' : 'col-span-5'}`}>Sin evidencia adjunta en esta sección.</div>}
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400">
                    <ScanBarcode className="w-16 h-16 mb-4 opacity-20" />
                    <p>Vista previa no configurada para formato Label</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
