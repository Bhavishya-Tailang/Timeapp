create database timeapp;

use timeapp;

create table `userdetails` (
`id` bigint auto_increment,
`name` varchar(255) not null,
`username` varchar(255) not null,
`role` varchar(255) not null,
`date` datetime default current_timestamp on update current_timestamp,
`delete` tinyint unsigned default 0,
primary key(`id`))
Engine = InnoDB;

create table `encryptionKeyDetails` (
`id` bigint auto_increment,
`username` varchar(255) not null,
`encryptionKey` varchar(255) not null,
`date` datetime default current_timestamp on update current_timestamp,
`delete` tinyint unsigned default 0,
primary key(`id`))
Engine = InnoDB;


create table `userCredentialDetails` (
`id` bigint auto_increment,
`encryptionKey` varchar(255) not null,
`password` varchar(255) not null,
`date` datetime default current_timestamp on update current_timestamp,
`delete` tinyint unsigned default 0,
primary key(`id`))
Engine = InnoDB;

create table `taskDetails` (
    `id` bigint auto_increment,
    `date` datetime default current_timestamp on update current_timestamp,
    `username` varchar(255) not null,
    `mangerId` varchar(255) not null,
    `projectCode` varchar(255) not null,
    `projrctName` varchar(255) not null,
    `rating` varchar(255) not null,
    `enteredTime` varchar(255) not null,
    `employeeRemarks` varchar(255) not null,
    `managerRemarks` varchar(255) not null,
    `status` varchar(255) not null,
    primary key(`id`))
Engine = InnoDB;