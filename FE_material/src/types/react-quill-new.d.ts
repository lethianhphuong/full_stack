// Type shim tạm thời cho react-quill-new (chưa cài được package trong môi trường này).
// SAU KHI cài package ở máy local (npm i react-quill-new), XÓA file này
// vì package đã có sẵn type definitions.
declare module 'react-quill-new' {
  import type { Component, ReactNode } from 'react';

  export interface QuillProps {
    value?: string;
    defaultValue?: string;
    onChange?: (value: string, delta: unknown, source: unknown, editor: unknown) => void;
    readOnly?: boolean;
    placeholder?: string;
    theme?: string;
    modules?: Record<string, unknown>;
    formats?: string[];
    style?: React.CSSProperties;
    className?: string;
    onFocus?: () => void;
    onBlur?: () => void;
    children?: ReactNode;
  }

  export default class ReactQuill extends Component<QuillProps> {}
}

declare module 'react-quill-new/dist/quill.snow.css';
