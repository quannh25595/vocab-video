import { QueryProvider } from "@/providers/query-provider";
import theme from "@/theme";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import type { Metadata } from "next";
import { SelectedWordsProvider } from "@/contexts/SelectedWordsContext";
import { ConfigProvider } from "@/contexts/ConfigContext";

export const metadata: Metadata = {
  title: "Vocab Video",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ConfigProvider>
          <SelectedWordsProvider>
            <AppRouterCacheProvider>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <QueryProvider>{children}</QueryProvider>
              </ThemeProvider>
            </AppRouterCacheProvider>
          </SelectedWordsProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
