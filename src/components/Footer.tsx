import { Separator } from '@/components/ui/separator';

const Footer = () => {
  return (
    <footer className="bg-muted/30 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              SAP Consultant
            </h3>
            <p className="text-sm text-muted-foreground">
              Helping businesses optimize their SAP systems and sharing knowledge 
              through technical expertise and community engagement.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Services
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>SAP Implementation</li>
              <li>System Integration</li>
              <li>Custom Development</li>
              <li>Performance Optimization</li>
              <li>Training & Support</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Latest Posts
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>S/4HANA Migration Guide</li>
              <li>Fiori Development Tips</li>
              <li>Integration Patterns</li>
              <li>ABAP Performance</li>
            </ul>
          </div>
        </div>
        
        <Separator className="mb-8" />
        
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2024 SAP Consultant. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;