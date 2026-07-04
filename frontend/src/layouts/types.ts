export interface AuthLayoutFooter {
    text: string;
    linkText: string;
    linkTo: string;
}

export interface AuthLayoutProps {
    title: string;
    subtitle?: string;
    children?: React.ReactNode;
    footer?: AuthLayoutFooter;
    error?: string | null;
}
