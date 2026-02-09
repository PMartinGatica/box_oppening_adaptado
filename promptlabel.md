// **********************************************************************
                      // *************** INICIO DE ETAPA: LABEL INSPECTION (PREVIEW) **********
                      // **********************************************************************
                      <div className="min-w-[700px] bg-white" ref={tableRef} id="printable-section">
                        
                        {/* Header Label - Orange/Brown Style */}
                        <div className="grid grid-cols-2 border border-black text-sm text-center">
                            <div className="bg-orange-200 border-r border-black font-bold p-1">New Product Open Box Check List -</div>
                            <div className="bg-orange-200 font-bold p-1">{formData.hardwareSku || 'XT...'}</div>
                            <div className="bg-orange-300 border-r border-t border-black font-bold p-1">Carrier:</div>
                            <div className="bg-orange-300 border-t border-black font-bold p-1 flex justify-around">
                                <span>Argentina</span>
                                <span>Master List</span>
                            </div>
                        </div>

                        {/* Title Bar */}
                        <div className="bg-orange-600 text-white font-bold text-center border-x border-b border-black text-sm">
                            Contenido de la caja física
                        </div>

                        {/* TABLA 1: EMBALAJE */}
                        <table className="w-full border-collapse border border-black text-xs">
                           <thead>
                               <tr className="bg-blue-100">
                                   <th className="border border-black p-1 w-8">#</th>
                                   <th className="border border-black p-1 w-40">EMBALAJE</th>
                                   <th className="border border-black p-1 text-center">Complete la información específica para el modelo de teléfono.</th>
                               </tr>
                           </thead>
                           <tbody>
                              {[
                                { id: 1, label: 'S/M', val: formData.salesModel },
                                { id: 2, label: 'TAC Code', val: formData.tacCode },
                                { id: 3, label: 'IMEI or MEID', val: formData.imeiLabel },
                                { id: 4, label: 'EAN CODE', val: formData.eanCode },
                                { id: 5, label: 'FCC ID', val: formData.fccId },
                                { id: 6, label: 'Product description', val: formData.productDescription },
                                { id: 8, label: 'Product label', val: formData.productLabelLocation, sub: 'Ubicacion' },
                              ].map((row) => (
                                <tr key={row.id} className="bg-white">
                                    <td className="border border-black p-1 text-center">{row.id}</td>
                                    <td className="border border-black p-1 font-bold">
                                        <div className="flex justify-between">
                                            <span>{row.label}</span>
                                            {row.sub && <span className="font-normal">{row.sub}</span>}
                                        </div>
                                    </td>
                                    <td className="border border-black p-1 text-center font-bold uppercase">{row.val}</td>
                                </tr>
                              ))}
                           </tbody>
                        </table>

                        {/* TABLA 2: CONTENIDO */}
                        <table className="w-full border-collapse border-x border-b border-black text-xs">
                           <thead>
                               <tr className="bg-blue-100">
                                   <th className="border border-black p-1 w-8"></th>
                                   <th className="border border-black p-1 w-40">Contenido de la caja</th>
                                   <th className="border border-black p-1 text-center">Complete la información específica para el modelo de teléfono.</th>
                               </tr>
                           </thead>
                           <tbody>
                              {[
                                { id: 9, label: 'BAT CVR', sub: 'Battery Door Assembly Number', val: formData.batCvrNumber },
                                { id: 10, label: 'XCVR', sub: 'CFC XCVR/Factory xcvr', val: formData.xcvrNo },
                                { id: 11, label: 'BX,BOX', sub: 'Caja unitaria', val: formData.unitBoxNumber },
                                { id: 12, label: 'SIMTRAY', sub: 'La bandeja del teléfono', val: formData.trayNumber },
                                { id: 13, label: 'Cod herramienta SIM', sub: 'Carton de herramienta SIM', val: formData.simToolInsert },
                                { id: 14, label: 'Sleeve', sub: 'Manga', val: formData.sleeveNumber },
                                { id: 15, label: 'Overpack', sub: '', val: formData.overpackNumber },
                                { id: 16, label: 'Overpack Insert', sub: '', val: formData.overpackInsertNumber },
                                { id: 17, label: 'MAN', sub: 'INSERTO CONTENIDO', val: formData.manualNumber },
                                { id: 18, label: 'Battery Energy Label', sub: 'Etiqueta de energía de la batería (AC ADAPTER MOTO)', val: formData.batteryLabel },
                                { id: 19, label: 'TAPE', sub: 'ETIQUETA VOID PARA MASTER BOX', val: formData.masterTape },
                                { id: 20, label: 'Custemer Cling', sub: 'Protector de pantalla o pañal', val: formData.customerCling },
                                { id: 21, label: 'Resist film', sub: '', val: formData.resistFilm },
                                { id: 22, label: 'Protecting sleeve', sub: 'Funda protectora', val: formData.protectingSleeve },
                                { id: 23, label: 'Sealing machine', sub: 'certificado de máquina selladora', val: formData.sealingMachine },
                                { id: 24, label: 'Seal Label', sub: 'Etiqueta de sello', val: formData.sealLabel },
                                { id: 25, label: 'Unit box label', sub: 'ETIQUETA VOID PARA CAJA UNITARIA', val: formData.unitBoxLabel },
                                { id: 26, label: 'IMEI Label', sub: 'Etiqueta IMEI', val: formData.imeiLabelPn },
                                { id: 27, label: 'VOID', sub: 'Etiqueta de seguridad', val: formData.voidLabel },
                                { id: 28, label: 'Tail box label', sub: 'Etiqueta de la caja de cola', val: formData.tailBoxLabel },
                                { id: 29, label: 'Carton box label', sub: 'Etiqueta de caja master', val: formData.cartonBoxLabel },
                                { id: 30, label: 'BAT CVR', sub: 'batería', val: formData.batteryCvr },
                                { id: 31, label: 'CHARGER', sub: 'Número de kit de cargador', val: formData.chargerKit },
                                { id: 32, label: 'DATCABLE', sub: 'Cable de datos', val: formData.dataCable },
                                { id: 33, label: 'Card pin', sub: 'Alfiler de tarjeta - herramienta', val: formData.cardPin },
                                { id: 34, label: 'Card pin paper', sub: 'Papel para alfileres de tarjetas', val: formData.cardPinPaper },
                                { id: 35, label: 'SIM CARD Part Number', sub: 'El ID de la tarjeta SIM coincide con el ID de la tarjeta SIM del contenido...', val: formData.simCardPn },
                                { id: 36, label: 'HEADSET', sub: 'Auriculares', val: formData.headset },
                                { id: 37, label: 'Código de aprobación...', sub: 'Compruebe que el código de aprobación coincide...', val: formData.palletLabelCode },
                              ].map((row) => (
                                <tr key={row.id} className="bg-white">
                                    <td className="border border-black p-1 w-8 text-center">{row.id}</td>
                                    <td className="border border-black p-1 w-[40%]">
                                        <div className="font-bold">{row.label}</div>
                                        <div className="text-[10px] text-slate-600">{row.sub}</div>
                                    </td>
                                    <td className="border border-black p-1 text-center font-bold">{row.val}</td>
                                </tr>
                              ))}
                           </tbody>
                        </table>

                        {/* NUEVA SECCIÓN: QA BOX OPENING CHECKLIST */}
                        <div className="mt-8 page-break-before avoid-break">
                            <div className="bg-[#B4C6E7] text-center font-bold border border-black p-1 text-sm">QA BOX OPENING CHECKLIST</div>
                            
                            {/* QA Header */}
                            <div className="border-x border-b border-black text-[10px] bg-[#E9EBF5]">
                                <div className="flex border-b border-black">
                                    <div className="w-24 p-1 font-bold border-r border-black">Product description :</div>
                                    <div className="flex-1 p-1 border-r border-black font-bold">{formData.productDescription}</div>
                                    <div className="w-16 p-1 font-bold border-r border-black bg-[#D9D9D9]">XCVR NO :</div>
                                    <div className="w-24 p-1 border-r border-black text-center">{formData.xcvrNo}</div>
                                    <div className="w-16 p-1 font-bold border-r border-black bg-[#D9D9D9]">Result:</div>
                                    <div className="w-16 p-1 text-center font-bold">PASS</div>
                                </div>
                                <div className="flex border-b border-black">
                                    <div className="w-24 p-1 font-bold border-r border-black">S/M :</div>
                                    <div className="flex-1 p-1 border-r border-black">{formData.salesModel}</div>
                                    <div className="w-16 p-1 font-bold border-r border-black bg-[#D9D9D9]">Received date:</div>
                                    <div className="w-24 p-1 border-r border-black text-center">{formData.date}</div>
                                    <div className="w-16 p-1 font-bold border-r border-black bg-[#D9D9D9]">Checked By:</div>
                                    <div className="w-16 p-1 text-center">{formData.inspector}</div>
                                </div>
                                <div className="flex">
                                    <div className="w-24 p-1 font-bold border-r border-black">Ship-to Region/Country:</div>
                                    <div className="flex-1 p-1 border-r border-black">{formData.country}</div>
                                    <div className="w-16 p-1 font-bold border-r border-black bg-[#D9D9D9]"></div>
                                    <div className="w-24 p-1 border-r border-black"></div>
                                    <div className="w-16 p-1 font-bold border-r border-black bg-[#D9D9D9]">Finished Date:</div>
                                    <div className="w-16 p-1 text-center">{formData.date}</div>
                                </div>
                            </div>

                            {/* QA Table */}
                            <table className="w-full border-collapse border border-black text-[10px]">
                                <thead>
                                    <tr className="bg-[#E9EBF5]">
                                        <th className="border border-black p-1 w-24">Pasos</th>
                                        <th className="border border-black p-1">Descripcion</th>
                                        <th className="border border-black p-1 w-16">Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {QA_CHECKLIST_ROWS.map((row) => (
                                        <tr key={row.id} className="bg-[#E2EFDA]">
                                            <td className="border border-black p-1 text-center font-bold bg-white">{row.step}</td>
                                            <td className="border border-black p-1">{row.desc}</td>
                                            <td className="border border-black p-1 text-center font-bold">
                                                {row.id === 'Q1' ? formData.salesModel : formData.qaChecklistValues[row.id]}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Evidencia Fotográfica Label */}
                        <div className="mt-8 page-break-before">
                             <div className="text-center mb-1"><h1 className="text-xl font-bold uppercase underline decoration-2 underline-offset-4">EVIDENCIA FOTOGRÁFICA</h1></div>
                             {photoSections.map((section) => (
                                <div key={section.id} className="mt-4 avoid-break">
                                    <div className="bg-purple-600 text-white font-bold p-1 border border-black text-sm">{section.title}</div>
                                    <div className="grid grid-cols-2 gap-2 border-x border-b border-black p-2">
                                        {images[section.id] && images[section.id].map((img, idx) => (
                                            img.src && (
                                                <div key={idx} className="flex flex-col items-center border border-slate-300 p-1">
                                                    <div className="relative w-full h-64 overflow-hidden bg-slate-100 flex items-center justify-center"><img src={img.src} className="max-w-full max-h-full object-contain" style={{ transform: `rotate(${img.rotation}deg) scale(${img.scale})` }} alt={`Evidence ${idx}`} /></div>
                                                </div>
                                            )
                                        ))}
                                        {(!images[section.id] || images[section.id].every(img => !img.src)) && <div className="col-span-2 text-center text-xs text-slate-400 italic py-8">Sin evidencia adjunta en esta sección.</div>}
                                    </div>
                                </div>
                             ))}
                        </div>
                      </div>
                      // **********************************************************************
                      // *************** FIN DE ETAPA: LABEL INSPECTION (PREVIEW) *************
                      // **********************************************************************