type ButtonProps = {
  title: string;
  onClickHandler: () => void;
};

export function Button({ title, onClickHandler  }: ButtonProps) {
    return (
        <>
            <button onClick={onClickHandler}>{title}</button>
        </>
    );
}