import React from "react";
import {
  Heart,
  Github,
  Twitter,
  Instagram,
  Facebook,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

const Footer = () => {
  const socialLinks = [
    {
      icon: Twitter,
      href: "#",
      label: "Twitter",
      color: "hover:text-blue-400",
    },
    {
      icon: Instagram,
      href: "#",
      label: "Instagram",
      color: "hover:text-pink-400",
    },
    {
      icon: Facebook,
      href: "#",
      label: "Facebook",
      color: "hover:text-blue-600",
    },
    { icon: Github, href: "#", label: "GitHub", color: "hover:text-gray-400" },
  ];

  const quickLinks = [
    { label: "About Us", href: "#about" },
    { label: "Contact", href: "#contact" },
    { label: "Privacy Policy", href: "#privacy" },
    { label: "Terms of Service", href: "#terms" },
    { label: "FAQ", href: "#faq" },
    { label: "Support", href: "#support" },
  ];

  const animeCategories = [
    { label: "Favourite", href: "#Favourite" },
    { label: "Isekai", href: "#Isekai" },
    { label: "Recommended For You", href: "#Recommended" },
    { label: "Romance", href: "#Romance" },
    { label: "Most Popular", href: "#Popular" },
  ];

  return (
    <footer className="relative bg-background text-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #ff69b4 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, #9370db 0%, transparent 50%),
                             radial-gradient(circle at 50% 50%, #00fa9a 0%, transparent 50%)`,
          }}
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Chibi + Brand */}
          <div className="flex items-start space-x-4">
            {/* Chibi */}
            <div className="w-14 h-14 relative shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 rounded-full animate-float shadow-lg transition-shadow duration-300">
                <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-2 bg-pink-600 rounded-full animate-pulse"></div>
                    <div
                      className="w-1.5 h-2 bg-blue-600 rounded-full animate-pulse"
                      style={{ animationDelay: "0.5s" }}
                    ></div>
                  </div>
                  <div className="absolute bottom-1.5 w-2 h-1 bg-pink-400 rounded-full opacity-80"></div>
                </div>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-mint-green-300 rounded-full animate-ping"></div>
                <div
                  className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-lavender-300 rounded-full animate-ping"
                  style={{ animationDelay: "1s" }}
                ></div>
              </div>
            </div>

            {/* Brand */}
            <div className="space-y-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                MANGAVERSE
              </span>
              <p className="text-gray-300 text-sm leading-relaxed">
                Your ultimate destination for anime content. Discover, watch,
                and connect with fellow anime enthusiasts from around the world.
              </p>
              <div className="flex space-x-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className={`w-9 h-9 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 ${social.color} hover:scale-110 hover:bg-white/20`}
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-pink-400 transition-colors duration-300 text-sm flex items-center group"
                  >
                    <span className="w-0 h-0.5 bg-pink-400 transition-all duration-300 group-hover:w-4 mr-0 group-hover:mr-2"></span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Categories
            </h3>
            <ul className="space-y-2">
              {animeCategories.map((category, index) => (
                <li key={index}>
                  <a
                    href={category.href}
                    className="text-gray-300 hover:text-purple-400 transition-colors duration-300 text-sm flex items-center group"
                  >
                    <span className="w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-4 mr-0 group-hover:mr-2"></span>
                    {category.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-blue-400 to-mint-400 bg-clip-text text-transparent">
              Get in Touch
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-400 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-300 text-sm">
                  contact@animenetwork.com
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-lg flex items-center justify-center">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-300 text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-mint-400 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-300 text-sm">Tokyo, Japan</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-300 text-sm">
            © 2025 MangaVerse. All rights reserved.
          </p>
          <div className="flex items-center space-x-2 text-gray-300 text-sm">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-pink-400 fill-current animate-pulse" />
            <span>for manga lovers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
