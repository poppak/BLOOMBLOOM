import React from 'react';
import {sendEmailNotification} from "../../http/productAPI";
import {Button, Modal} from "react-bootstrap";

const Notice = ({show, onHide, status, name}) => {
    switch (status) {
        case 'Запись открыта':
            return (
                <Modal show={show}
                       onHide={onHide}
                       size='lg'
                       style={{marginLeft: '30%', width: "40%", borderRadius: 0}}>
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Уведомление
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Отправить уведомление об открытии закупки?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className='btn-2' onClick={() => sendEmailNotification('Закупка открыта', name, `<br>На нашем сайте <a href="https://bloombloomkr.ru">bloombloomkr.ru</a> открыта новая совместная закупка! <br>Будем рады вашему участию`).then(onHide())}>Да</Button>
                    </Modal.Footer>
                </Modal>
            )
        case 'Запись закрыта':
            return (
                <Modal show={show}
                       onHide={onHide}
                       size='lg'
                       style={{marginLeft: '30%', width: "40%", borderRadius: 0}}>
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Уведомление
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Отправить уведомление о закрытии записи в закупку?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className='btn-2' onClick={() => sendEmailNotification('Запись в закупку закрыта', name, `<br>Запись в закупку закрыта! Перейдите по ссылке, чтобы посмотреть свой <a href="https://bloombloomkr.ru">заказ</a>!`).then(onHide())}>Да</Button>
                    </Modal.Footer>
                </Modal>
            )
        case 'Сбор оплаты':
            return (
                <Modal show={show}
                       onHide={onHide}
                       size='lg'
                       style={{marginLeft: '30%', width: "40%", borderRadius: 0}}>
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Уведомление
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Отправить уведомление об оплате?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className='btn-2' onClick={() => sendEmailNotification('Оплата заказа', name, `<br>Время оплатить заказ! Перейдите по ссылке, чтобы посмотреть свой <a href="https://bloombloomkr.ru">заказ</a>!`).then(onHide())}>Да</Button>
                    </Modal.Footer>
                </Modal>
            )
        case 'Отменена':
            return (
                <Modal show={show}
                       onHide={onHide}
                       size='lg'
                       style={{marginLeft: '30%', width: "40%", borderRadius: 0}}>
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Уведомление
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Отправить уведомление об отмене закупки?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className='btn-2' onClick={() => sendEmailNotification('Закупка отменена', name, `<br>К сожалению, мы вынуждены отменить закупку :( <br>До новых встреч!`).then(onHide())}>Да</Button>
                    </Modal.Footer>
                </Modal>
            )
        case 'Рассылка заказов':
            return (
                <Modal show={show}
                       onHide={onHide}
                       size='lg'
                       style={{marginLeft: '30%', width: "40%", borderRadius: 0}}>
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Уведомление
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Отправить уведомление о сборе данных для доставки?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className='btn-2' onClick={() => sendEmailNotification('Отправка заказа по РФ', name, `<br>Время оформить доставку своего заказа! Перейдите по ссылке, чтобы посмотреть свой <a href="https://bloombloomkr.ru">заказ</a>!`).then(onHide())}>Да</Button>
                    </Modal.Footer>
                </Modal>
            )
        default:
            show = false
            break
    }
};

export default Notice;