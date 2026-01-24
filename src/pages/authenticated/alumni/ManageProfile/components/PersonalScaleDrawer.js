/* global $ */
import { FormControl, InputLabel, OutlinedInput, Slider, Typography, useMediaQuery, useTheme } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react'
import useGetToken from '../../../../../hooks/useGetToken';
import { useNavigate } from 'react-router-dom';
import useSystemURLCon from '../../../../../hooks/useSystemURLCon';
import ModalTemplate from '../../../components/ModalTemplate/ModalTemplate';

const PersonalScaleDrawer = ({ id, data, modalTitle, callbackFunction, isFromGuest = false }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { getToken } = useGetToken();
    const { url } = useSystemURLCon();
    const navigate = useNavigate();

    const [generalAppearance, setGeneralAppearance] = useState(0);
    const [mannerOfSpeaking, setMannerOfSpeaking] = useState(0);
    const [physicalCondition, setPhysicalCondition] = useState(0);
    const [mentalAlertness, setMentalAlertness] = useState(0);
    const [selfConfidence, setSelfConfidence] = useState(0);
    const [abilityToPresentIdeas, setAbilityToPresentIdeas] = useState(0);
    const [communicationSkills, setCommunicationSkills] = useState(0);
    const [studentPerformanceRating, setStudentPerformanceRating] = useState(0);

    const handleClose = () => {
        if (isFromGuest) {
            callbackFunction({
                generalAppearance,
                mannerOfSpeaking,
                physicalCondition,
                mentalAlertness,
                selfConfidence,
                abilityToPresentIdeas,
                communicationSkills,
                studentPerformanceRating
            });
        } else callbackFunction(false);

        $(`#personal_scale_info_${id}`).modal('hide');
    }

    const SubmitPersonalScale = async () => {
        try {
            setIsSubmitting(true);

            if (isFromGuest) {
                return;
            }

            const atoken = getToken('access_token');
            const formData = new FormData();
            formData.append('general_appearance', generalAppearance);
            formData.append('manner_of_speaking', mannerOfSpeaking);
            formData.append('physical_condition', physicalCondition);
            formData.append('mental_alertness', mentalAlertness);
            formData.append('self_confidence', selfConfidence);
            formData.append('ability_to_present_ideas', abilityToPresentIdeas);
            formData.append('communication_skills', communicationSkills);
            formData.append('student_performance_rating', studentPerformanceRating);
            if (data) formData.append('documentId', data.id);

            const response = await axios.post(`${url}/authenticated/job-seeker/manage-account/update-personal-scale`, formData, {
                headers: {
                    Authorization: `Bearer ${atoken}`
                }
            });

            if (response.data.success) {
                handleClose();
            }
        } catch (error) {
            error.response.data.status === 500
                ? navigate('/access-denied')
                : alert(error.response.data.message);
        } finally {
            handleClose();
            setIsSubmitting(false);
        }
    }

    useEffect(() => {
        if (data) {
            setGeneralAppearance(data.general_appearance || 0);
            setMannerOfSpeaking(data.manner_of_speaking || 0);
            setPhysicalCondition(data.physical_condition || 0);
            setMentalAlertness(data.mental_alertness || 0);
            setSelfConfidence(data.self_confidence || 0);
            setAbilityToPresentIdeas(data.ability_to_present_ideas || 0);
            setCommunicationSkills(data.communication_skills || 0);
            setStudentPerformanceRating(data.student_performance_rating || 0);
        }
    }, [data]);

    return (
        <>
            <ModalTemplate
                id={`personal_scale_info_${id}`}
                isModalCentered={true}
                header={
                    <span className="modal-title text-sm">
                        <strong>{modalTitle}</strong>
                    </span>
                }
                bodyClassName={'px-4 pb-2'}
                body={
                    <>
                        <div className="row">
                            {/* General Appearance */}
                            <div className="col-xl-12 px-3 mb-4">
                                <Typography variant="subtitle1" className="fw-bold">My General Appearance</Typography>
                                <Typography variant="caption" display="block" className="text-muted mb-2">
                                    Rate your confidence in maintaining a professional appearance, grooming, and attire suitable for your target industry.
                                </Typography>
                                <Slider
                                    color="success"
                                    value={generalAppearance}
                                    onChange={(e, val) => setGeneralAppearance(val)}
                                    step={1}
                                    marks
                                    min={0}
                                    max={5}
                                    valueLabelDisplay="auto"
                                />
                            </div>

                            {/* Manner of Speaking */}
                            <div className="col-xl-12 px-3 mb-4">
                                <Typography variant="subtitle1" className="fw-bold">My Manner of Speaking</Typography>
                                <Typography variant="caption" display="block" className="text-muted mb-2">
                                    How would you rate your ability to speak clearly, professionally, and politely during interviews or workplace discussions?
                                </Typography>
                                <Slider
                                    color="success"
                                    value={mannerOfSpeaking}
                                    onChange={(e, val) => setMannerOfSpeaking(val)}
                                    step={1}
                                    marks
                                    min={0}
                                    max={5}
                                    valueLabelDisplay="auto"
                                />
                            </div>

                            {/* Physical Condition */}
                            <div className="col-xl-12 px-3 mb-4">
                                <Typography variant="subtitle1" className="fw-bold">Physical Vitality & Posture</Typography>
                                <Typography variant="caption" display="block" className="text-muted mb-2">
                                    Assess your personal energy levels, physical readiness, and professional posture when engaging in work-related activities.
                                </Typography>
                                <Slider
                                    color="success"
                                    value={physicalCondition}
                                    onChange={(e, val) => setPhysicalCondition(val)}
                                    step={1}
                                    marks
                                    min={0}
                                    max={5}
                                    valueLabelDisplay="auto"
                                />
                            </div>

                            {/* Mental Alertness */}
                            <div className="col-xl-12 px-3 mb-4">
                                <Typography variant="subtitle1" className="fw-bold">Mental Alertness</Typography>
                                <Typography variant="caption" display="block" className="text-muted mb-2">
                                    Rate your ability to process instructions quickly and provide thoughtful, intelligent answers to challenging questions.
                                </Typography>
                                <Slider
                                    color="success"
                                    value={mentalAlertness}
                                    onChange={(e, val) => setMentalAlertness(val)}
                                    step={1}
                                    marks
                                    min={0}
                                    max={5}
                                    valueLabelDisplay="auto"
                                />
                            </div>

                            {/* Self-Confidence */}
                            <div className="col-xl-12 px-3 mb-4">
                                <Typography variant="subtitle1" className="fw-bold">Self-Confidence & Poise</Typography>
                                <Typography variant="caption" display="block" className="text-muted mb-2">
                                    How confident do you feel when presenting yourself? Rate your ability to stay composed and steady under pressure.
                                </Typography>
                                <Slider
                                    color="success"
                                    value={selfConfidence}
                                    onChange={(e, val) => setSelfConfidence(val)}
                                    step={1}
                                    marks
                                    min={0}
                                    max={5}
                                    valueLabelDisplay="auto"
                                />
                            </div>

                            {/* Ability to Present Ideas */}
                            <div className="col-xl-12 px-3 mb-4">
                                <Typography variant="subtitle1" className="fw-bold">Ability to Present Ideas</Typography>
                                <Typography variant="caption" display="block" className="text-muted mb-2">
                                    Assess how well you can organize your thoughts and explain your ideas logically and persuasively to others.
                                </Typography>
                                <Slider
                                    color="success"
                                    value={abilityToPresentIdeas}
                                    onChange={(e, val) => setAbilityToPresentIdeas(val)}
                                    step={1}
                                    marks
                                    min={0}
                                    max={5}
                                    valueLabelDisplay="auto"
                                />
                            </div>

                            {/* Communication Skills */}
                            <div className="col-xl-12 px-3 mb-4">
                                <Typography variant="subtitle1" className="fw-bold">Communication Proficiency</Typography>
                                <Typography variant="caption" display="block" className="text-muted mb-2">
                                    Rate your overall skill in using English (or your primary work language) to deliver clear and effective workplace messages.
                                </Typography>
                                <Slider
                                    color="success"
                                    value={communicationSkills}
                                    onChange={(e, val) => setCommunicationSkills(val)}
                                    step={1}
                                    marks
                                    min={0}
                                    max={5}
                                    valueLabelDisplay="auto"
                                />
                            </div>

                            {/* Student Performance Rating */}
                            <div className="col-xl-12 px-3 mb-4">
                                <Typography variant="subtitle1" className="fw-bold">Self-Perceived Professional Rating</Typography>
                                <Typography variant="caption" display="block" className="text-muted mb-2">
                                    Reflecting on your academic and behavioral record, how would you rate your overall performance as a candidate?
                                </Typography>
                                <Slider
                                    color="success"
                                    value={studentPerformanceRating}
                                    onChange={(e, val) => setStudentPerformanceRating(val)}
                                    step={1}
                                    marks
                                    min={0}
                                    max={5}
                                    valueLabelDisplay="auto"
                                />
                            </div>
                        </div>
                    </>
                }
                footer={
                    <>
                        <button type='button' className='btn btn-default elevation-1 mr-1' onClick={() => handleClose()}>
                            <i className='fas fa-times text-danger mr-2'></i> Close
                        </button>

                        <button type="button" onClick={() => SubmitPersonalScale()} disabled={
                            generalAppearance <= 0 ||
                            mannerOfSpeaking <= 0 ||
                            physicalCondition <= 0 ||
                            mentalAlertness <= 0 ||
                            selfConfidence <= 0 ||
                            abilityToPresentIdeas <= 0 ||
                            communicationSkills <= 0 ||
                            studentPerformanceRating <= 0 ||
                            isSubmitting
                        } className={`btn btn-success elevation-1`}>
                            <i className='fas fa-save mr-2'></i> {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </>
                }
            />
        </>
    )
}

export default PersonalScaleDrawer;