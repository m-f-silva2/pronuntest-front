import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-modal',
  standalone: true,
  imports: [],
  templateUrl: './user-modal.component.html',
  styleUrl: './user-modal.component.css'
})
export class UserModalComponent {
  isModalOpen = false;

  users = [
    { id: 1, name: 'Juan Pérez', email: 'juan.perez@example.com' },
    { id: 2, name: 'María García', email: 'maria.garcia@example.com' },
    { id: 3, name: 'Carlos Sánchez', email: 'carlos.sanchez@example.com' },
    // Agrega más usuarios según sea necesario
  ];

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  editUser(user: { name: string; }) {
    alert('Editar usuario: ' + user.name);
    // Aquí puedes implementar la lógica para editar el usuario
  }

  deleteUser(user: { name: string; id: number; }) {
    if (confirm('¿Estás seguro de que deseas eliminar a ' + user.name + '?')) {
      this.users = this.users.filter(u => u.id !== user.id);
      alert('Usuario eliminado');
    }
  }
}
