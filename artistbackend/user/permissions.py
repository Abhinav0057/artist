from rest_framework import permissions


class IsSuperAdmin(permissions.BasePermission):
    """
    Allows access only to super admin.
    """
    message = "You are not authenticated to perfom this action"
    def has_permission(self, request, view):
        return request.user.role_type == 'super_admin'

class IsArtistManager(permissions.BasePermission):
    """
    Allows acess only to artist manager
    """
    message = "You are not authenticated to perfom this action"
    def has_permission(self, request, view):
        return request.user.role_type == 'artist_manager'
class IsArtist(permissions.BasePermission):
    """
    Allows acess only to artist 
    """
    message = "You are not authenticated to perfom this action"
    def has_permission(self, request, view):
        return request.user.role_type == 'artist'