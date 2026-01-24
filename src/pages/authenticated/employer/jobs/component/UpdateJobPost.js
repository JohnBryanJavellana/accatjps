/* global $ */
import ModalTemplate from '../../../components/ModalTemplate/ModalTemplate';
import CreateJobAd from '../CreateJobAd';

const UpdateJobPost = ({ id, data, modalTitle, callbackFunction }) => {
    const handleClose = () => {
        callbackFunction(false);
        $(`#update_job_post_${id}`).modal('hide');
    }

    console.log(data);


    return (
        <>
            <ModalTemplate
                id={`update_job_post_${id}`}
                isModalCentered={true}
                size={'xl'}
                bodyClassName={'px-0 pt-4 pb-2'}
                body={
                    <>
                        <CreateJobAd data={data} modalId={`update_job_post_${id}`} callbackFunction={() => {
                            callbackFunction();
                            handleClose();
                        }} />
                    </>
                }
            />
        </>
    )
}

export default UpdateJobPost