CREATE TABLE `accounts` (
  `id` integer  NOT NULL PRIMARY KEY AUTOINCREMENT
,  `account` varchar(255) NOT NULL
,  `type` text  NOT NULL
,  `retirement` integer NOT NULL DEFAULT 0
,  `inactive` integer NOT NULL DEFAULT 0
,  `savings` integer NOT NULL DEFAULT 0
,  `priority` integer NOT NULL
);
CREATE TABLE `categories` (
  `id` integer  NOT NULL PRIMARY KEY AUTOINCREMENT
,  `category` varchar(255) NOT NULL
,  `type` text  NOT NULL
,  `inactive` integer NOT NULL DEFAULT 0
,  `priority` integer NOT NULL DEFAULT 0
);
CREATE TABLE `expenses` (
  `id` integer  NOT NULL PRIMARY KEY AUTOINCREMENT
,  `date` date NOT NULL
,  `item` varchar(255) DEFAULT NULL
,  `category_id` integer  NOT NULL
,  `amount` integer NOT NULL DEFAULT 0
,  CONSTRAINT `expenses_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
);
CREATE TABLE `income` (
  `id` integer  NOT NULL PRIMARY KEY AUTOINCREMENT
,  `date` date NOT NULL
,  `item` varchar(255) NOT NULL
,  `amount` integer NOT NULL DEFAULT 0
,  `retirement` integer NOT NULL DEFAULT 0
);
CREATE TABLE `tags` (
  `id` integer NOT NULL PRIMARY KEY AUTOINCREMENT
,  `text` varchar(255) NOT NULL
);
CREATE TABLE `budgets` (
  `id` integer  NOT NULL PRIMARY KEY AUTOINCREMENT
,  `date` date NOT NULL
,  `category_id` integer  NOT NULL
,  `amount` integer NOT NULL DEFAULT 0
,  UNIQUE (`date`,`category_id`)
,  CONSTRAINT `budgets_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
);
CREATE INDEX "idx_budgets_category_id" ON "budgets" (`category_id`);
CREATE TABLE `expense_tags` (
  `id` integer NOT NULL PRIMARY KEY AUTOINCREMENT
,  `tag_id` integer NOT NULL
,  `expense_id` integer NOT NULL
,  CONSTRAINT `expense_tags_ibfk_1` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`)
,  CONSTRAINT `expense_tags_ibfk_2` FOREIGN KEY (`expense_id`) REFERENCES `expenses` (`id`)
);
CREATE TABLE `goals` (
  `id` integer NOT NULL PRIMARY KEY AUTOINCREMENT
,  `goal` varchar(255) NOT NULL
,  `priority` integer NOT NULL
,  `amount` integer NOT NULL DEFAULT 0
,  `due_date` date NOT NULL
,  `goal_amount` integer NOT NULL DEFAULT 0
,  `inactive` integer NOT NULL DEFAULT 0
);
CREATE TABLE `networth` (
  `id` integer  NOT NULL PRIMARY KEY AUTOINCREMENT
,  `date` date NOT NULL
,  `account` integer  NOT NULL
,  `amount` integer NOT NULL DEFAULT 0
,  UNIQUE (`date`,`account`)
);
