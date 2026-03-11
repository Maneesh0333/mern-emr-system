import React from "react";

type HeaderProps = {
  title: string;
  description: string;
}

function Header({title, description}: HeaderProps) {
  return (
    <header className="mb-5">
      <h3 className="font-playfair text-3xl font-black mb-2">{title}</h3>
      <p className="text-sm text-[var(--earth)]">
        {description}
      </p>
    </header>
  );
}

export default Header;
