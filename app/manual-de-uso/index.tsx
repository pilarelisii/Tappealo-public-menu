import {
	BadgePercent,
	BookOpen,
	ChevronDown,
	ChevronRight,
	CreditCard,
	FileSpreadsheet,
	FolderCog,
	LayoutDashboard,
	Menu,
	Pencil,
	PlusCircle,
	QrCode,
	Star,
	Store,
	UtensilsCrossed,
	X,
} from "lucide-react-native";
import React, { useRef, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

type SectionItem = {
	id: string;
	label: string;
	icon: React.ElementType;
	children?: SectionItem[];
};

const sections: SectionItem[] = [
	{ id: "vista-principal", label: "Vista Principal", icon: LayoutDashboard },
	{
		id: "menu",
		label: "Menú",
		icon: UtensilsCrossed,
		children: [
			{ id: "cargar-excel", label: "Cargar por Excel", icon: FileSpreadsheet },
			{ id: "agregar-producto", label: "Agregar Producto", icon: PlusCircle },
			{
				id: "gestionar-categorias",
				label: "Gestionar Categorías",
				icon: FolderCog,
			},
			{ id: "productos-destacados", label: "Productos Destacados", icon: Star },
			{ id: "editar-productos", label: "Editar Productos", icon: Pencil },
		],
	},
	{ id: "promociones", label: "Promociones", icon: BadgePercent },
	{ id: "qrs", label: "Gestión de QR", icon: QrCode },
	{ id: "comercio", label: "Comercio", icon: Store },
	{ id: "metodos-pago", label: "Métodos de Pago", icon: CreditCard },
];

export default function Index() {
	const [activeSection, setActiveSection] = useState("vista-principal");
	const [menuOpen, setMenuOpen] = useState(true);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const scrollRef = useRef<ScrollView>(null);
	const contentRef = useRef<View>(null);
	const sectionRefs = useRef<Record<string, View | null>>({});

	const scrollToSection = (id: string) => {
		const section = sectionRefs.current[id];
		const content = contentRef.current;

		if (!section || !content || !scrollRef.current) return;

		section.measureLayout(
			content,
			(_x, y) => {
				scrollRef.current?.scrollTo({
					y: Math.max(y - 20, 0),
					animated: true,
				});
			},
			() => {
				console.log("No se pudo medir la sección:", id);
			}
		);
	};

	const handleSectionPress = (id: string) => {
		setActiveSection(id);
		setMobileMenuOpen(false);

		requestAnimationFrame(() => {
			scrollToSection(id);
		});
	};

	return (
		<View className="flex-1 bg-white">
			<View className="flex-row flex-1">
				{/* Sidebar */}
				<View
					className={`${
						mobileMenuOpen ? "flex" : "hidden"
					} absolute left-0 top-0 z-50 h-full w-72 bg-foreground px-4 py-6 md:relative md:flex`}
				>
					<View className="mb-6 flex-row items-center gap-3 border-b border-white/10 pb-6">
						<View className="h-10 w-10 items-center justify-center rounded-lg bg-white/10">
							<BookOpen size={20} color="white" />
						</View>
						<View>
							<Text className="text-sm font-bold tracking-wide text-white">
								Manual de Uso
							</Text>
							<Text className="text-xs text-accent">
								Guía completa del sistema
							</Text>
						</View>
					</View>

					<Text className="mb-3 px-2 text-[10px] font-semibold uppercase tracking-widest text-accent">
						Secciones
					</Text>

					<ScrollView showsVerticalScrollIndicator={false}>
						{sections.map((s) => {
							const Icon = s.icon;
							const isActive = activeSection === s.id;
							const hasChildren = !!s.children?.length;
							const isChildActive =
								hasChildren && s.children!.some((c) => activeSection === c.id);

							return (
								<View key={s.id} className="mb-1">
									<Pressable
										onPress={() => {
											if (hasChildren) setMenuOpen(!menuOpen);
											handleSectionPress(s.id);
										}}
										className={`flex-row items-center rounded-lg px-3 py-3 ${
											isActive || isChildActive
												? "bg-white/10"
												: "bg-transparent"
										}`}
									>
										<Icon
											size={16}
											color={isActive || isChildActive ? "#ffffff" : "#D9C7BA"}
										/>
										<Text
											className={`ml-3 flex-1 text-sm ${
												isActive || isChildActive
													? "font-semibold text-white"
													: "text-accent"
											}`}
										>
											{s.label}
										</Text>

										{hasChildren ? (
											<ChevronDown
												size={14}
												color="#ffffff"
												style={{
													transform: [{ rotate: menuOpen ? "0deg" : "-90deg" }],
												}}
											/>
										) : isActive ? (
											<ChevronRight size={14} color="#ffffff" />
										) : null}
									</Pressable>

									{hasChildren && menuOpen && (
										<View className="ml-5 mt-1 border-l border-white/10 pl-3">
											{s.children!.map((child) => {
												const ChildIcon = child.icon;
												const isChildItemActive = activeSection === child.id;

												return (
													<Pressable
														key={child.id}
														onPress={() => handleSectionPress(child.id)}
														className={`mb-1 flex-row items-center rounded-lg px-3 py-2 ${
															isChildItemActive
																? "bg-white/10"
																: "bg-transparent"
														}`}
													>
														<ChildIcon
															size={14}
															color={isChildItemActive ? "#ffffff" : "#D9C7BA"}
														/>
														<Text
															className={`ml-3 flex-1 text-sm ${
																isChildItemActive
																	? "font-semibold text-white"
																	: "text-accent"
															}`}
														>
															{child.label}
														</Text>
														{isChildItemActive ? (
															<ChevronRight size={12} color="#ffffff" />
														) : null}
													</Pressable>
												);
											})}
										</View>
									)}
								</View>
							);
						})}
					</ScrollView>
				</View>

				{/* Main */}
				<View className="flex-1">
					<View className="flex-row items-center justify-between bg-foreground px-4 py-4 md:hidden">
						<Pressable onPress={() => setMobileMenuOpen(!mobileMenuOpen)}>
							{mobileMenuOpen ? (
								<X size={22} color="white" />
							) : (
								<Menu size={22} color="white" />
							)}
						</Pressable>
						<Text className="text-base font-bold text-white">
							Manual de Uso
						</Text>
						<View className="w-6" />
					</View>

					<ScrollView
						ref={scrollRef}
						className="flex-1 bg-white"
						showsVerticalScrollIndicator={false}
					>
						<View ref={contentRef}>
							<View className="bg-foreground px-6 py-12">
								<View className="mb-4 self-start rounded-full bg-white/10 px-4 py-1.5">
									<Text className="text-xs font-medium text-white">
										Documentación Oficial
									</Text>
								</View>

								<Text className="mb-4 text-3xl font-extrabold text-white">
									Manual de Uso
								</Text>

								<Text className="text-base text-accent">
									Guía completa para administrar tu sistema de pedidos, menú
									digital, QR y métodos de pago.
								</Text>
							</View>

							<View className="px-6 py-8">
								<Section
									id="vista-principal"
									title="Vista Principal"
									icon={LayoutDashboard}
									number="01"
									activeSection={activeSection}
									sectionRefs={sectionRefs}
								>
									<Text className="mb-4 text-sm leading-6 text-foreground">
										La vista principal es tu centro de control. Desde aquí podés
										gestionar todas las operaciones del día a día.
									</Text>

									<FeatureCard
										title="Vista de Pedidos"
										description="Visualizá todos los pedidos activos en tiempo real."
									/>
									<FeatureCard
										title="Historial de Pedidos"
										description="Pedidos ordenados por día con su referencia única."
									/>
									<FeatureCard
										title="Calls (Llamadas)"
										description="Llamadas al mozo. Podés marcar como visto y resolver para eliminarlas."
									/>
								</Section>

								<Section
									id="menu"
									title="Menú"
									icon={UtensilsCrossed}
									number="02"
									activeSection={activeSection}
									sectionRefs={sectionRefs}
								>
									<Text className="text-sm leading-6 text-foreground">
										Sección dedicada a la gestión completa de tu carta digital.
										Desde acá podés cargar, editar, organizar y destacar
										productos.
									</Text>
								</Section>

								<Section
									id="cargar-excel"
									title="Cargar por Excel"
									icon={FileSpreadsheet}
									number="03"
									activeSection={activeSection}
									sectionRefs={sectionRefs}
								>
									<Text className="mb-4 text-sm leading-6 text-foreground">
										Podés cargar productos de forma masiva usando un archivo
										Excel. El archivo debe tener estas columnas:
									</Text>

									<View className="overflow-hidden rounded-xl border border-slate-200 bg-white">
										{/* Header */}
										<View className="flex-row bg-slate-100">
											<View className="flex-1 border-r border-slate-200 px-3 py-3">
												<Text className="text-xs font-bold uppercase text-foreground">
													Nombre
												</Text>
											</View>
											<View className="flex-1 border-r border-slate-200 px-3 py-3">
												<Text className="text-xs font-bold uppercase text-foreground">
													Descripción
												</Text>
											</View>
											<View className="w-24 border-r border-slate-200 px-3 py-3">
												<Text className="text-xs font-bold uppercase text-foreground">
													Precio
												</Text>
											</View>
											<View className="flex-1 px-3 py-3">
												<Text className="text-xs font-bold uppercase text-foreground">
													Categoría
												</Text>
											</View>
										</View>

										{/* Row 1 */}
										<View className="flex-row border-t border-slate-200 bg-white">
											<View className="flex-1 border-r border-slate-200 px-3 py-3">
												<Text className="text-sm text-foreground">
													Café con leche
												</Text>
											</View>
											<View className="flex-1 border-r border-slate-200 px-3 py-3">
												<Text className="text-sm text-foreground">
													Bebida caliente con leche
												</Text>
											</View>
											<View className="w-24 border-r border-slate-200 px-3 py-3">
												<Text className="text-sm text-foreground">4200</Text>
											</View>
											<View className="flex-1 px-3 py-3">
												<Text className="text-sm text-foreground">BEBIDAS</Text>
											</View>
										</View>

										{/* Row 2 */}
										<View className="flex-row border-t border-slate-200 bg-slate-50">
											<View className="flex-1 border-r border-slate-200 px-3 py-3">
												<Text className="text-sm text-foreground">
													Medialunas
												</Text>
											</View>
											<View className="flex-1 border-r border-slate-200 px-3 py-3">
												<Text className="text-sm text-foreground">
													2 medialunas dulces
												</Text>
											</View>
											<View className="w-24 border-r border-slate-200 px-3 py-3">
												<Text className="text-sm text-foreground">2800</Text>
											</View>
											<View className="flex-1 px-3 py-3">
												<Text className="text-sm text-foreground">
													PANADERIA
												</Text>
											</View>
										</View>
									</View>

									<Text className="mt-4 text-sm leading-6 text-slate-600">
										Importante: la primera fila debe contener los encabezados
										exactamente como se muestra arriba.
									</Text>
								</Section>

								<Section
									id="agregar-producto"
									title="Agregar Producto"
									icon={PlusCircle}
									number="04"
									activeSection={activeSection}
									sectionRefs={sectionRefs}
								>
									<Text className="mb-4 text-sm leading-6 text-foreground">
										Cargá productos de forma manual completando los siguientes
										datos:
									</Text>

									<DataRow text="Nombre" />
									<DataRow text="Descripción" />
									<DataRow text="Precio" />
									<DataRow text="Categoría" />
									<DataRow text="Imagen" />
								</Section>

								<Section
									id="gestionar-categorias"
									title="Gestionar Categorías"
									icon={FolderCog}
									number="05"
									activeSection={activeSection}
									sectionRefs={sectionRefs}
								>
									<Text className="mb-4 text-sm leading-6 text-foreground">
										Para agregar una categoría, ingresá el nombre deseado.
									</Text>

									<WarningCard text="Importante: si deshabilitás una categoría, los productos que pertenecen a esa categoría no se verán en el menú público." />
								</Section>

								<Section
									id="productos-destacados"
									title="Productos Destacados"
									icon={Star}
									number="06"
									activeSection={activeSection}
									sectionRefs={sectionRefs}
								>
									<Text className="mb-4 text-sm leading-6 text-foreground">
										Podés destacar hasta 4 productos que aparecerán en la parte
										superior del menú público.
									</Text>
								</Section>

								<Section
									id="editar-productos"
									title="Editar Productos"
									icon={Pencil}
									number="07"
									activeSection={activeSection}
									sectionRefs={sectionRefs}
								>
									<Text className="text-sm leading-6 text-foreground">
										Con el botón Editar podés modificar y eliminar productos en
										tiempo real. Los cambios se reflejan inmediatamente en el
										menú público.
									</Text>
								</Section>

								<Section
									id="promociones"
									title="Promociones"
									icon={BadgePercent}
									number="08"
									activeSection={activeSection}
									sectionRefs={sectionRefs}
								>
									<Text className="mb-4 text-sm leading-6 text-foreground">
										Cargá promociones que aparecerán primero en el menú público.
										Cada promoción incluye:
									</Text>

									<StepItem
										step="1"
										text="Nombre de la promoción + opción de Habilitar."
									/>
									<StepItem
										step="2"
										text="Incluir productos: seleccioná productos y cantidades que forman la promo."
									/>
									<StepItem
										step="3"
										text="Descuento: porcentaje o monto fijo a descontar."
									/>
									<StepItem
										step="4"
										text="Imagen: agregá una imagen representativa."
									/>
									<StepItem
										step="5"
										text="ON/OFF: controlá si la promoción aparece o no en el menú público."
									/>
								</Section>

								<Section
									id="qrs"
									title="Gestión de QR para Mesas"
									icon={QrCode}
									number="09"
									activeSection={activeSection}
									sectionRefs={sectionRefs}
								>
									<Text className="mb-4 text-sm leading-6 text-foreground">
										Cada QR generado es único para cada mesa o ubicación. El
										botón Servicio Activo administra si el menú aparece al
										público o no.
									</Text>

									<Text className="mb-3 text-sm font-semibold text-foreground">
										Agregar QR
									</Text>
									<Text className="mb-4 text-sm leading-6 text-foreground">
										Ingresá un nombre para identificarlo (ej: Mesa 1, Barra,
										Delivery) y seleccioná el tipo de entrega:
									</Text>

									<FeatureCard
										title="En el lugar"
										description="QRs ubicados dentro del restaurante."
									/>
									<FeatureCard
										title="Retiro"
										description="Locaciones fuera del restaurante, el cliente retira."
									/>
									<FeatureCard
										title="Envío"
										description="El restaurante se acerca al cliente."
									/>
								</Section>

								<Section
									id="comercio"
									title="Comercio"
									icon={Store}
									number="10"
									activeSection={activeSection}
									sectionRefs={sectionRefs}
								>
									<Text className="mb-4 text-sm leading-6 text-foreground">
										Los siguientes datos aparecerán en el menú público:
									</Text>

									<DataRow text="Logo" />
									<DataRow text="Instagram" />
									<DataRow text="Teléfono" />
									<DataRow text="Ubicación" />
								</Section>

								<Section
									id="metodos-pago"
									title="Métodos de Pago"
									icon={CreditCard}
									number="11"
									activeSection={activeSection}
									sectionRefs={sectionRefs}
								>
									<Text className="mb-4 text-sm leading-6 text-foreground">
										Desde esta sección podés administrar los medios de cobro del
										comercio.
									</Text>

									<FeatureCard
										title="Efectivo"
										description="Disponible para pagos presenciales."
									/>

									<FeatureCard
										title="Mercado Pago"
										description="Requiere configurar Public Key y Access Token desde Mercado Pago Developers."
									/>

									<FeatureCard
										title="Tarjeta Débito / Crédito"
										description="Próximamente."
									/>
								</Section>
							</View>
						</View>
					</ScrollView>
				</View>
			</View>
		</View>
	);
}

function Section({
	id,
	title,
	icon: Icon,
	number,
	children,
	activeSection,
	sectionRefs,
}: {
	id: string;
	title: string;
	icon: React.ElementType;
	number: string;
	children: React.ReactNode;
	activeSection: string;
	sectionRefs: React.MutableRefObject<Record<string, View | null>>;
}) {
	const isActive = activeSection === id;

	return (
		<View
			ref={(ref) => {
				sectionRefs.current[id] = ref;
			}}
			className={`mb-8 rounded-2xl border p-5 ${
				isActive ? "border-foreground bg-slate-50" : "border-slate-200 bg-white"
			}`}
		>
			<View className="mb-4 flex-row items-center">
				<View className="mr-4 h-12 w-12 items-center justify-center rounded-xl bg-accent">
					<Icon size={22} color="#3D220F" />
				</View>
				<View>
					<Text className="text-xs font-bold uppercase tracking-widest text-foreground">
						{number}
					</Text>
					<Text className="text-xl font-bold text-foreground">{title}</Text>
				</View>
			</View>
			{children}
		</View>
	);
}

function FeatureCard({
	title,
	description,
}: {
	title: string;
	description: string;
}) {
	return (
		<View className="mb-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
			<Text className="mb-1 text-sm font-semibold text-foreground">
				{title}
			</Text>
			<Text className="text-sm leading-5 text-slate-600">{description}</Text>
		</View>
	);
}

function StepItem({ step, text }: { step: string; text: string }) {
	return (
		<View className="mb-3 flex-row items-start gap-3">
			<View className="h-7 w-7 items-center justify-center rounded-full bg-foreground">
				<Text className="text-xs font-bold text-white">{step}</Text>
			</View>
			<Text className="flex-1 pt-1 text-sm leading-5 text-foreground">
				{text}
			</Text>
		</View>
	);
}

function DataRow({ text }: { text: string }) {
	return (
		<View className="mb-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
			<Text className="text-sm text-foreground">{text}</Text>
		</View>
	);
}

function WarningCard({ text }: { text: string }) {
	return (
		<View className="rounded-xl border border-orange-200 bg-orange-50 p-4">
			<Text className="text-sm leading-5 text-foreground">{text}</Text>
		</View>
	);
}

function ExampleCard({ lines }: { lines: string[] }) {
	return (
		<View className="rounded-xl border border-slate-200 bg-slate-50 p-4">
			{lines.map((line, index) => (
				<Text key={index} className="mb-1 text-sm leading-5 text-foreground">
					{line}
				</Text>
			))}
		</View>
	);
}
