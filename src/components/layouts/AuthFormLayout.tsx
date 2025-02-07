import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

interface AuthFormLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: {
    text: string;
    linkText: string;
    linkTo: string;
  };
  variant?: 'default' | 'split' | 'card';
  image?: {
    src: string;
    alt: string;
  };
  logo?: React.ReactNode;
  additionalContent?: React.ReactNode;
}

export const AuthFormLayout: React.FC<AuthFormLayoutProps> = ({
  title,
  subtitle,
  children,
  footer,
  variant = 'default',
  image,
  logo,
  additionalContent,
}) => {
  const layouts = {
    default: (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-full max-w-sm">
          {logo && <div className="mb-8 flex justify-center">{logo}</div>}
          <AuthContent
            title={title}
            subtitle={subtitle}
            children={children}
            footer={footer}
            additionalContent={additionalContent}
          />
        </div>
      </div>
    ),

    split: (
      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Image Section */}
        <div className="hidden lg:flex lg:w-1/2 relative">
          {image ? (
            <img
              src={image.src}
              alt={image.alt}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" />
          )}
          {logo && (
            <div className="absolute top-8 left-8 text-white">
              {logo}
            </div>
          )}
        </div>

        {/* Form Section */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-12 bg-gray-50">
          <div className="w-full max-w-sm">
            <div className="lg:hidden mb-8 flex justify-center">{logo}</div>
            <AuthContent
              title={title}
              subtitle={subtitle}
              children={children}
              footer={footer}
              additionalContent={additionalContent}
            />
          </div>
        </div>
      </div>
    ),

    card: (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-full max-w-4xl flex gap-8 bg-white rounded-2xl shadow-xl p-8">
          {/* Image Section */}
          {image && (
            <div className="hidden lg:block lg:w-1/2 relative rounded-xl overflow-hidden">
              <img
                src={image.src}
                alt={image.alt}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          )}

          {/* Form Section */}
          <div className={cn("flex-1", !image && "max-w-sm mx-auto")}>
            {logo && <div className="mb-8 flex justify-center">{logo}</div>}
            <AuthContent
              title={title}
              subtitle={subtitle}
              children={children}
              footer={footer}
              additionalContent={additionalContent}
            />
          </div>
        </div>
      </div>
    ),
  };

  return layouts[variant];
};

// Shared content component
const AuthContent: React.FC<Omit<AuthFormLayoutProps, 'variant' | 'image' | 'logo'>> = ({
  title,
  subtitle,
  children,
  footer,
  additionalContent,
}) => (
  <>
    <div className="mb-8 text-center">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
        {title}
      </h1>
      <p className="text-sm text-gray-600 mt-2">
        {subtitle}
      </p>
    </div>

    <div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-100">
      {children}
    </div>

    <div className="mt-6 text-center text-sm text-muted-foreground">
      {footer.text}{' '}
      <Link to={footer.linkTo} className="text-primary hover:underline">
        {footer.linkText}
      </Link>
    </div>

    {additionalContent && (
      <div className="mt-6">
        {additionalContent}
      </div>
    )}
  </>
); 