import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Shield, Users, CreditCard } from "lucide-react";
import djWackoMainLogo from "@/assets/dj-wacko-main-logo.gif";

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="absolute inset-0 bg-black/20"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Button>
          
          <div className="flex items-center gap-2">
            <img 
              src={djWackoMainLogo} 
              alt="DJ Wacko Logo" 
              className="w-10 h-10 object-contain"
            />
            <span className="text-white font-bold text-xl">DJ Wacko</span>
          </div>
        </div>

        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-white flex items-center justify-center gap-2">
              <FileText className="w-8 h-8" />
              Términos de Uso y Servicio
            </CardTitle>
            <p className="text-white/80 mt-2">
              Última actualización: {new Date().toLocaleDateString('es-ES')}
            </p>
          </CardHeader>
          
          <CardContent className="space-y-8 text-white">
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-xl font-semibold">
                <Users className="w-6 h-6" />
                1. Aceptación de Términos
              </div>
              <p className="text-white/90 leading-relaxed">
                Al utilizar los servicios de DJ Wacko, usted acepta cumplir con estos términos de uso. 
                Si no está de acuerdo con alguno de estos términos, por favor no utilice nuestros servicios.
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2 text-xl font-semibold">
                <Shield className="w-6 h-6" />
                2. Descripción del Servicio
              </div>
              <div className="text-white/90 leading-relaxed space-y-3">
                <p>
                  DJ Wacko ofrece servicios de entretenimiento musical que incluyen:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Solicitudes de canciones en tiempo real</li>
                  <li>Sistema de propinas para priorizar canciones</li>
                  <li>Interacción directa con el DJ</li>
                  <li>Ambiente musical personalizado para eventos</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2 text-xl font-semibold">
                <CreditCard className="w-6 h-6" />
                3. Pagos y Propinas
              </div>
              <div className="text-white/90 leading-relaxed space-y-3">
                <p><strong>Propina Mínima:</strong> $2.00 USD por solicitud de canción</p>
                <p><strong>Procesamiento:</strong> Los pagos se procesan de forma segura a través de Stripe</p>
                <p><strong>Reembolsos:</strong> Las propinas no son reembolsables una vez procesadas</p>
                <p><strong>Prioridad:</strong> Las canciones con mayor propina tendrán prioridad en la lista de reproducción</p>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2 text-xl font-semibold">
                <FileText className="w-6 h-6" />
                4. Responsabilidades del Usuario
              </div>
              <div className="text-white/90 leading-relaxed space-y-3">
                <p>Al utilizar nuestros servicios, usted se compromete a:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Proporcionar información precisa y actualizada</li>
                  <li>No solicitar contenido ofensivo, inapropiado o ilegal</li>
                  <li>Respetar los derechos de autor de la música solicitada</li>
                  <li>Mantener un comportamiento respetuoso hacia el DJ y otros usuarios</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2 text-xl font-semibold">
                <Shield className="w-6 h-6" />
                5. Privacidad y Protección de Datos
              </div>
              <div className="text-white/90 leading-relaxed space-y-3">
                <p>
                  Nos comprometemos a proteger su privacidad. La información recopilada incluye:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Nombre y datos de contacto (opcional)</li>
                  <li>Información de pago (procesada de forma segura por Stripe)</li>
                  <li>Historial de solicitudes de canciones</li>
                  <li>Usuario de Telegram (opcional, para comunicación directa)</li>
                </ul>
                <p className="mt-3">
                  Sus datos nunca serán compartidos con terceros sin su consentimiento explícito.
                </p>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2 text-xl font-semibold">
                <FileText className="w-6 h-6" />
                6. Limitaciones del Servicio
              </div>
              <div className="text-white/90 leading-relaxed space-y-3">
                <ul className="list-disc pl-6 space-y-1">
                  <li>El DJ se reserva el derecho de rechazar solicitudes inapropiadas</li>
                  <li>No garantizamos que todas las canciones solicitadas estén disponibles</li>
                  <li>Los tiempos de reproducción pueden variar según el evento y la audiencia</li>
                  <li>El servicio puede estar sujeto a interrupciones técnicas</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2 text-xl font-semibold">
                <Shield className="w-6 h-6" />
                7. Modificaciones de los Términos
              </div>
              <p className="text-white/90 leading-relaxed">
                DJ Wacko se reserva el derecho de modificar estos términos en cualquier momento. 
                Los cambios serán notificados a través de nuestra plataforma y entrarán en vigor 
                inmediatamente después de su publicación.
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2 text-xl font-semibold">
                <Users className="w-6 h-6" />
                8. Contacto
              </div>
              <div className="text-white/90 leading-relaxed space-y-2">
                <p>Para cualquier consulta sobre estos términos, contáctanos:</p>
                <p><strong>Email:</strong> djwacko@outlook.es</p>
                <p><strong>Telegram:</strong> @djwacko</p>
              </div>
            </section>

            <div className="bg-white/5 p-6 rounded-lg border border-white/10 mt-8">
              <p className="text-center text-white/80 text-sm">
                Al continuar usando nuestros servicios, usted acepta estos términos de uso. 
                Si tiene preguntas, no dude en contactarnos.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Terms;