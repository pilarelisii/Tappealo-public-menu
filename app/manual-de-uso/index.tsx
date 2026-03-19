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
      { id: "gestionar-categorias", label: "Gestionar Categorías", icon: FolderCog },
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
                      isActive || isChildActive ? "bg-white/10" : "bg-transparent"
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
                              isChildItemActive ? "bg-white/10" : "bg-transparent"
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
            <Text className="text-base font-bold text-white">Manual de Uso</Text>
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
                  Guía completa para administrar tu sistema de pedidos, menú digital,
                  QR y métodos de pago.
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
                  <Text className="mb-4 text-sm text-foreground">
                    La vista principal es tu centro de control. Desde aquí podés
                    gestionar todas las operaciones del día a día.
                  </Text>
                </Section>

                <Section
                  id="menu"
                  title="Menú"
                  icon={UtensilsCrossed}
                  number="02"
                  activeSection={activeSection}
                  sectionRefs={sectionRefs}
                >
                  <Text className="text-sm text-foreground">
                    Sección dedicada a la gestión completa de tu carta digital.
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
                  <Text className="text-sm text-foreground">
                    Podés cargar productos de forma masiva usando un archivo Excel.
                  </Text>
                </Section>

                <Section
                  id="agregar-producto"
                  title="Botón Agregar"
                  icon={PlusCircle}
                  number="04"
                  activeSection={activeSection}
                  sectionRefs={sectionRefs}
                >
                  <Text className="text-sm text-foreground">
                    Cargá productos de forma manual.
                  </Text>
                </Section>

                <Section
                  id="gestionar-categorias"
                  title="Gestionar Categorías"
                  icon={FolderCog}
                  number="05"
                  activeSection={activeSection}
                  sectionRefs={sectionRefs}
                >
                  <Text className="text-sm text-foreground">
                    Agregá o deshabilitá categorías.
                  </Text>
                </Section>

                <Section
                  id="productos-destacados"
                  title="Productos Destacados"
                  icon={Star}
                  number="06"
                  activeSection={activeSection}
                  sectionRefs={sectionRefs}
                >
                  <Text className="text-sm text-foreground">
                    Podés destacar hasta 4 productos.
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
                  <Text className="text-sm text-foreground">
                    Modificá o eliminá productos.
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
                  <Text className="text-sm text-foreground">
                    Creá promociones con porcentaje o monto fijo.
                  </Text>
                </Section>

                <Section
                  id="qrs"
                  title="Gestión de QR para Mesas"
                  icon={QrCode}
                  number="09"
                  activeSection={activeSection}
                  sectionRefs={sectionRefs}
                >
                  <Text className="text-sm text-foreground">
                    Cada QR es único para cada mesa o ubicación.
                  </Text>
                </Section>

                <Section
                  id="comercio"
                  title="Comercio"
                  icon={Store}
                  number="10"
                  activeSection={activeSection}
                  sectionRefs={sectionRefs}
                >
                  <Text className="text-sm text-foreground">
                    Configurá logo, Instagram, teléfono y ubicación.
                  </Text>
                </Section>

                <Section
                  id="metodos-pago"
                  title="Métodos de Pago"
                  icon={CreditCard}
                  number="11"
                  activeSection={activeSection}
                  sectionRefs={sectionRefs}
                >
                  <Text className="text-sm text-foreground">
                    Administrá los medios de cobro.
                  </Text>
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