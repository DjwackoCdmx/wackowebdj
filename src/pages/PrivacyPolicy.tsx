import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Header user={null} isAdmin={false} onLogout={() => {}} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-black/50 p-8 rounded-lg shadow-lg border border-purple-400/30">
          <h1 className="text-4xl font-bold mb-4 text-purple-400">Política de Privacidad</h1>
          <p className="mb-4">Última actualización: 18 de Julio de 2024</p>

          <h2 className="text-2xl font-semibold mt-6 mb-2 text-purple-300">1. Introducción</h2>
          <p className="text-gray-300">
            Bienvenido a DJ Wacko. Nos comprometemos a proteger tu información personal y tu derecho a la privacidad. Si tienes alguna pregunta o inquietud sobre nuestra política o nuestras prácticas con respecto a tu información personal, por favor contáctanos.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2 text-purple-300">2. Información que Recopilamos</h2>
          <p className="text-gray-300">
            Recopilamos información personal que nos proporcionas voluntariamente cuando te registras en la aplicación, expresas interés en obtener información sobre nosotros o nuestros productos y servicios, cuando participas en actividades en la aplicación o de otra manera cuando nos contactas.
          </p>
          <p className="text-gray-300 mt-2">
            La información personal que recopilamos puede incluir lo siguiente:
          </p>
          <ul className="list-disc list-inside ml-4 text-gray-300">
            <li>Nombre y Datos de Contacto (nombre, usuario de Telegram).</li>
            <li>Credenciales (nombres de usuario, contraseñas, sugerencias de contraseñas).</li>
            <li>Datos de Pago (procesados a través de Stripe, no almacenamos los detalles de tu tarjeta).</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6 mb-2 text-purple-300">3. Cómo Usamos tu Información</h2>
          <p className="text-gray-300">
            Utilizamos la información personal recopilada a través de nuestra aplicación para diversos fines comerciales que se describen a continuación. Procesamos tu información personal para estos fines en función de nuestros intereses comerciales legítimos, para celebrar o ejecutar un contrato contigo, con tu consentimiento, y/o para cumplir con nuestras obligaciones legales.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2 text-purple-300">4. ¿Se Compartirá tu Información con Alguien?</h2>
          <p className="text-gray-300">
            Solo compartimos información con tu consentimiento, para cumplir con las leyes, para proporcionarte servicios, para proteger tus derechos o para cumplir con obligaciones comerciales.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2 text-purple-300">5. Tus Derechos de Privacidad</h2>
          <p className="text-gray-300">
            En algunas regiones (como el Espacio Económico Europeo), tienes ciertos derechos bajo las leyes de protección de datos aplicables. Estos pueden incluir el derecho (i) a solicitar acceso y obtener una copia de tu información personal, (ii) a solicitar la rectificación o el borrado; (iii) a restringir el procesamiento de tu información personal; y (iv) si corresponde, a la portabilidad de datos.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-2 text-purple-300">6. Contacto</h2>
          <p className="text-gray-300">
            Si tienes preguntas o comentarios sobre esta política, puedes contactarnos por correo electrónico a [correo@ejemplo.com].
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
