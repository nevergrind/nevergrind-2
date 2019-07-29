<?php
$ctx = new ZMQContext();
$socket = $ctx->getSocket(ZMQ::SOCKET_PUSH);
$socket->connect("tcp://127.0.0.1:5555");