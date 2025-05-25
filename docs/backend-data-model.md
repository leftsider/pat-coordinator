# Database Schema Design

---

### Core Entities

- **Users** (guests, property owners, admins)
- **Properties** (each vacation property)
- **Bookings** (who is staying, when)
- **Documents** (customs forms, PDFs, etc.)

---

### Entity-Relationship Diagram (ERD)

Here’s a simple text-based ERD for the app

```
User
 └─< Booking >─┐
			   ├─ Property
			   └─ Document
```

---

### Table Structures

#### **users**
| Column        | Type           | Constraints           | Notes                     |
|---------------|----------------|-----------------------|---------------------------|
| id            | SERIAL         | PRIMARY KEY           |                           |
| name          | VARCHAR(100)   | NOT NULL              |                           |
| email         | VARCHAR(255)   | UNIQUE, NOT NULL      |                           |
| role          | VARCHAR(20)    | DEFAULT 'guest'       | guest, owner, admin, etc. |
| created_at    | TIMESTAMP      | DEFAULT now()         |                           |

#### **properties**
| Column        | Type           | Constraints           | Notes                     |
|---------------|----------------|-----------------------|---------------------------|
| id            | SERIAL         | PRIMARY KEY           |                           |
| owner_id      | INTEGER        | REFERENCES users(id)  |                           |
| name          | VARCHAR(100)   | NOT NULL              |                           |
| address       | TEXT           |                       |                           |
| description   | TEXT           |                       |                           |

#### **bookings**
| Column        | Type           | Constraints           | Notes                     |
|---------------|----------------|-----------------------|---------------------------|
| id            | SERIAL         | PRIMARY KEY           |                           |
| property_id   | INTEGER        | REFERENCES properties(id) |                       |
| user_id       | INTEGER        | REFERENCES users(id)  |                           |
| start_date    | DATE           | NOT NULL              |                           |
| end_date      | DATE           | NOT NULL              |                           |
| status        | VARCHAR(20)    | DEFAULT 'pending'     | confirmed, canceled, etc. |
| created_at    | TIMESTAMP      | DEFAULT now()         |                           |

#### **documents**
| Column        | Type           | Constraints           | Notes                     |
|---------------|----------------|-----------------------|---------------------------|
| id            | SERIAL         | PRIMARY KEY           |                           |
| booking_id    | INTEGER        | REFERENCES bookings(id) |                        |
| url           | TEXT           | NOT NULL              | Path to PDF or S3 URL     |
| type          | VARCHAR(50)    |                       | e.g., customs_form        |
| created_at    | TIMESTAMP      | DEFAULT now()         |                           |


---

## ENUM Types Reference

### User Roles (`user_role`)

| Value    | Description                        |
|----------|------------------------------------|
| guest    | Default for property guests        |
| owner    | Property owner/manager             |
| admin    | System administrator               |

**Usage:**  
The `users.role` column uses the `user_role` ENUM type to ensure only valid roles are stored.

---

### Booking Statuses (`booking_status`)

| Value      | Description                        |
|------------|------------------------------------|
| pending    | Awaiting confirmation/approval     |
| confirmed  | Booking is active and confirmed    |
| canceled   | Booking was canceled               |

**Usage:**  
The `bookings.status` column uses the `booking_status` ENUM type to enforce valid booking states.

---

### How to Update ENUMs

If you need to add a new value to an ENUM type in the future, use:

```sql
ALTER TYPE user_role ADD VALUE 'new_role';
ALTER TYPE booking_status ADD VALUE 'new_status';
```

**Note:**  
Adding new ENUM values requires a database migration and cannot be easily undone—plan changes carefully.

---

**Where Used:**
- `users.role` uses `user_role`
- `bookings.status` uses `booking_status`

---

