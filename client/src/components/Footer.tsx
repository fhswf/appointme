
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {

    return (
        <footer className="w-full py-6 bg-background border-t mt-auto">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-center items-center gap-6 text-sm text-muted-foreground">
                <Link to="/impressum" className="hover:underline">
                    Impressum
                </Link>
                <Link to="/privacy" className="hover:underline">
                    Datenschutzhinweise
                </Link>
            </div>
        </footer>
    );
};

export default Footer;
