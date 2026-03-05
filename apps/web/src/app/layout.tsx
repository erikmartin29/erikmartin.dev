export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "system-ui, sans-serif",
            textAlign: "center",
          }}
        >
          <div>
            <h1>Under Maintenance 🔨👨🏼‍💻 </h1>
            <p>Lots of improvements coming soon. We&apos;ll be back shortly.</p>
            <p>In the meantime, you can follow me on <a href="https://www.linkedin.com/in/erikmartin29/" target="_blank" rel="noopener noreferrer">LinkedIn</a>.</p>
          </div>
        </div>
      </body>
    </html>
  );
}
