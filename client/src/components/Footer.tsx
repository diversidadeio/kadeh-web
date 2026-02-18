/**
 * Footer Component — Tech-Forward Minimalism
 * Design: Minimal footer with clear information hierarchy
 * Spacing: Generous padding, clear typography
 */

import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-border py-16">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <span className="font-bold text-lg text-foreground">Kadeh</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Navegação indoor com IA e analytics em tempo real.
            </p>
          </div>

          {/* Soluções */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Soluções</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/#solucoes" className="hover:text-primary transition-colors">Kadeh Varejo</Link></li>
              <li><Link href="/#solucoes" className="hover:text-primary transition-colors">Kadeh Shopping</Link></li>
              <li><Link href="/#solucoes" className="hover:text-primary transition-colors">Kadeh Eventos</Link></li>
              <li><Link href="/#solucoes" className="hover:text-primary transition-colors">Kadeh Saúde</Link></li>
              <li><Link href="/#solucoes" className="hover:text-primary transition-colors">Kadeh Localiza</Link></li>
              <li><Link href="/picking" className="hover:text-primary transition-colors">Kadeh Picking</Link></li>
              <li><Link href="/smart-layout" className="hover:text-primary transition-colors">Kadeh Smart Layout</Link></li>
              <li><Link href="/data-intelligence" className="hover:text-primary transition-colors">Kadeh Intelligence</Link></li>
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Empresa</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/#como-funciona" className="hover:text-primary transition-colors">Como Funciona</Link></li>
              <li><Link href="/#faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contato</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Privacidade</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Termos de Uso</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">LGPD</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; 2025 Kadeh. Todos os direitos reservados.</p>
          <p>Tecnologia registrada no INPI • Exclusividade nacional (set/2025)</p>
        </div>
      </div>
    </footer>
  );
}
