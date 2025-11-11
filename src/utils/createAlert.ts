import Swal, { type SweetAlertIcon } from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export function createAlert(title: string, text: string, icon?: SweetAlertIcon): void {
    withReactContent(Swal).fire({
        title,
        text,
        icon,
        theme: 'auto'
    })
}
