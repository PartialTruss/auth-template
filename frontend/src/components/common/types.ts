import type React from "react";
import type { ComponentProps } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    type: string,
    label: string

}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    type: "button" | "reset" | "submit" | undefined,
    text: string
}

export interface CheckBoxProps extends ComponentProps<"input"> {
    text: string;
    secondary_text: string;
    checked: boolean;
}

export interface GoogleUrlProps {
    googleUrl: string;
    text: string
}