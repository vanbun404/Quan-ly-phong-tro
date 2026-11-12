import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="container mx-auto px-6 py-12 grid md:grid-cols-5 gap-8">
        {/* Logo + Mô tả */}
        <div className="md:col-span-2">
          <h3 className="text-2xl font-bold text-white mb-4">
            <span className="text-teal-400">N</span>hóm 9
          </h3>
          <p className="mb-4">
            hỗ trợ tìm kiếm và đặt chỗ cho các loại chỗ ở khác nhau như nhà,
            phòng, căn hộ và căn hộ dịch vụ.
          </p>
          <div className="flex space-x-4 text-xl">
            <a href="#" className="hover:text-teal-400">
              <FaFacebookF />
            </a>
            <a href="#" className="hover:text-teal-400">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-teal-400">
              <FaTwitter />
            </a>
            <a href="#" className="hover:text-teal-400">
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* Project */}
        <div>
          <h5 className="text-white font-semibold mb-4">Project</h5>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-teal-400">
                Houses
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-teal-400">
                Rooms
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-teal-400">
                Flats
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-teal-400">
                Appartments
              </a>
            </li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h5 className="text-white font-semibold mb-4">Company</h5>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-teal-400">
                How we work ?
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-teal-400">
                Capital
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-teal-400">
                Security
              </a>
            </li>
          </ul>
        </div>

        {/* Movement */}
        <div>
          <h5 className="text-white font-semibold mb-4">Movement</h5>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-teal-400">
                Movement
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-teal-400">
                Support us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-teal-400">
                Pricing
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-6">
        <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row justify-between text-sm text-gray-400">
          <p>Tranbun2005@gmail.com | số điện thoại:0343605120</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
