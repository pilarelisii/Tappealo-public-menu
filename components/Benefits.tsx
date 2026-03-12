import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const heroRestaurant = require("@/assets/images/hero-restaurant.jpg");
const CTASection = () => {
	return (
		<section className="relative py-20 md:py-28 overflow-hidden">
			<div className="absolute inset-0">
				<img
					src={heroRestaurant}
					alt=""
					className="w-full h-full object-cover"
				/>
				<div className="absolute inset-0 bg-foreground/80" />
			</div>
			<div className="container mx-auto px-4 relative z-10 text-center">
				<h2 className="text-3xl md:text-5xl font-display text-primary-foreground mb-4">
					Llevá tu restaurante al siguiente nivel
				</h2>
				<p className="font-body text-primary-foreground/80 max-w-xl mx-auto mb-8 text-lg">
					Descubrí cómo Tappealo puede mejorar la experiencia de tus clientes y
					optimizar tu operación.
				</p>
				<a href="https://w.app/fij1pn">
					<Button
					//variant="hero"
					//size="xl"
					>
						Solicitar demo
						<ArrowRight className="ml-1" />
					</Button>
				</a>
			</div>
		</section>
	);
};

export default CTASection;
