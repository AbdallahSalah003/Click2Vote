type FieldProps = {
  placeholder: string;
  maxLength: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function TextField({ placeholder , maxLength, onChange }: FieldProps) {
    return (
        <>
            <input maxLength={maxLength} type="text" placeholder={placeholder} onChange={onChange}/>
        </>
    );
}