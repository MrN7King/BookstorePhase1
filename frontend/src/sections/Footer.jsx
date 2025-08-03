import { Typography } from "@material-tailwind/react";
import { Link } from 'react-router-dom';

const gotoContactUs = () => {
  navigate('/contactus');
  closePanel();
};

const gotoAboutUs = () => {
  navigate('/aboutus');
  closePanel();
};

// Directly define the content for each section based on the image
const footerContent = {
  books: {
    title: "Books",
    description: "Books Delivered. Imagination Unlimited.",
  },
  quickLinks: {
    title: "Quick Links",
    links: [{ name: "Home", path: "/" },
    { name: "About Us", path: "/aboutus" },
    { name: "Contact", path: "/contactus" },],
  },
  contact: {
    title: "Contact",
    details: [
      "Email: mssonukri@gmail.com",
      "Phone: +91 7061543815",
      "MMEC, Mullana - 133207",
    ],
  },
  weAccept: {
    title: "We Accept",
    paymentMethods: [
      { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Visa.svg/2560px-Visa.svg.png", alt: "Visa" },
      { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/800px-Mastercard-logo.svg.png", alt: "MasterCard" },
      { src: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/800px-American_Express_logo_%282018%29.svg.png", alt: "American Express" },
    ],
  },
};

const currentYear = new Date().getFullYear();

export function FooterWithSitemap() {
  return (
    <footer className="w-full bg-black py-12 px-8 text-white">
      <div className="mx-auto max-w-7xl grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {/* Books Section */}
        <div>
          <Typography variant="h6" className="mb-4 font-bold">
            {footerContent.books.title}
          </Typography>
          <Typography variant="small" className="font-normal">
            {footerContent.books.description}
          </Typography>
        </div>

        {/* Quick Links Section */}
        <div>
          <Typography variant="h6" className="mb-4 font-bold">
            {footerContent.quickLinks.title}
          </Typography>
          <ul className="space-y-1">
            {footerContent.quickLinks.links.map((link, linkIdx) => (
              <li key={linkIdx}>
                <Link
                  to={link.path} // Use `to` prop with the path
                  className="text-white font-normal inline-block hover:text-blue-500 transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <Typography variant="h6" className="mb-4 font-bold">
            {footerContent.contact.title}
          </Typography>
          <ul className="space-y-1">
            {footerContent.contact.details.map((detail, detailIdx) => (
              <li key={detailIdx}>
                <Typography variant="small" className="font-normal">
                  {detail}
                </Typography>
              </li>
            ))}
          </ul>
        </div>

        {/* We Accept Section */}
        <div>
          <Typography variant="h6" className="mb-4 font-bold">
            {footerContent.weAccept.title}
          </Typography>
          <div className="flex gap-2">
            {footerContent.weAccept.paymentMethods.map((method, methodIdx) => (
              <img
                key={methodIdx}
                src={method.src}
                alt={method.alt}
                className="h-6" // Adjust height as needed
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 border-t border-gray-700 pt-6 flex flex-col justify-center items-center"> {/* Changed here */}
        <Typography variant="small" className="text-center text-white"> {/* Removed mb-4 and md:mb-0 */}
          &copy; {currentYear} Books. All rights reserved.
        </Typography>
        {/* Social icons removed as per the reference image */}
      </div>
    </footer>
  );
}