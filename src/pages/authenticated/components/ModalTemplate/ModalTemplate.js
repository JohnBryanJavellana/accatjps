/* global $ */
import { useEffect } from 'react';
import './ModalTemplate.css';

const ModalTemplate = ({
    id,
    rounded = true,
    modalParentStyle,
    isModalCentered,
    modalDialogStyle,
    isModalScrollable = true,
    headerClassName,
    header,
    body,
    bodyClassName,
    footer,
    modalContentClassName,
    footerClassName,
    size = 'sm' | 'md' | 'lg' | 'xl'
}) => {
    useEffect(() => {
        $(window).on('popstate', function () { $(`#${id}`).modal('hide'); });
        $('.modal-footer .fas').removeClass('mr-2');
        $('.modal-footer .fas').addClass('mr-1');
        $('.modal-footer .btn').addClass('btn-sm');
    }, [id]);

    return (
        <>
            <div className={`modal fade ${modalParentStyle}`} data-backdrop="static" data-keyboard="false" id={id}>
                <div className={`modal-dialog ${modalDialogStyle} modal-${size} ${isModalScrollable && 'modal-dialog-scrollable'} ${isModalCentered && 'modal-dialog-centered'}`}>
                    <div className={`modal-content ${!rounded && 'rounded-0'} text-dark ${modalContentClassName}`}>
                        {header && <div className={`modal-header border-light ${headerClassName}`}>{header}</div>}
                        <div className={`modal-body ${bodyClassName}`}>{body}</div>
                        {footer && <div className={`modal-footer border-light py-1 ${footerClassName}`}>{footer}</div>}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ModalTemplate;