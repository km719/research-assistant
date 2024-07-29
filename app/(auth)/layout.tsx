export default function AuthLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
        <div className="p-6">
          <div className="flex items-center justify-center h-full">
              {children}
          </div>
        </div>
    );
  }