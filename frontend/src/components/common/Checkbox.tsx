import type { CheckBoxProps } from "./types";

const Checkbox = ({
  text,
  secondary_text,
  checked,
  ...rest
}: CheckBoxProps) => {
  return (
    <>
      <div className="checkbox-wrapper-46">
        <input
          type="checkbox"
          id="cbx-46"
          className="inp-cbx"
          checked={checked}
          {...rest}
        />
        <label htmlFor="cbx-46" className="cbx flex items-center gap-2">
          <span>
            <svg viewBox="0 0 12 10" height="10px" width="12px">
              <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
            </svg>
          </span>
          <p className="flex gap-1 text-sm">
            {text}
            <p className="underline"> {secondary_text}</p>
          </p>
        </label>
      </div>
    </>
  );
};

export default Checkbox;
