const Footer = () => {
  return (
    <footer className="footer">
      <div>
        <h3>Public Voice</h3>
        <p>
          A MERN-based online polling and petition platform for digital civic
          participation.
        </p>
      </div>

      <p className="footer-copy">
        © {new Date().getFullYear()} Public Voice. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;