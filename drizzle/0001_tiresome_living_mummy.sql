CREATE TABLE `distribuicoes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventoId` int NOT NULL,
	`pessoaId` int NOT NULL,
	`dropId` int NOT NULL,
	`dataEscolha` timestamp NOT NULL DEFAULT (now()),
	`observacoes` text,
	`criadoEm` timestamp NOT NULL DEFAULT (now()),
	`atualizadoEm` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `distribuicoes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `drops` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(255) NOT NULL,
	`tipo` varchar(255),
	`eventoId` int NOT NULL,
	`status` enum('Disponível','Escolhido','Entregue') NOT NULL DEFAULT 'Disponível',
	`criadoEm` timestamp NOT NULL DEFAULT (now()),
	`atualizadoEm` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `drops_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `eventos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(255) NOT NULL,
	`data` timestamp NOT NULL,
	`descricao` text,
	`criadoEm` timestamp NOT NULL DEFAULT (now()),
	`atualizadoEm` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `eventos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `participacoes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventoId` int NOT NULL,
	`pessoaId` int NOT NULL,
	`criadoEm` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `participacoes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pessoas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(255) NOT NULL,
	`classe` varchar(255),
	`observacoes` text,
	`criadoEm` timestamp NOT NULL DEFAULT (now()),
	`atualizadoEm` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pessoas_id` PRIMARY KEY(`id`)
);
