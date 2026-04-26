import { useEffect } from "react";
import { useToasts } from "../../customHooks/CustomToastsProvider";
import { suscribeToErrorEvent } from "../../modules/ErrorEvent";

export default function ErrorToasts() {
    const { addToast } = useToasts();

    useEffect(() => {
        suscribeToErrorEvent((err) => {
            addToast({
                title: "Error",
                message: err,
                variant: "danger"
            });
        })
    })
}