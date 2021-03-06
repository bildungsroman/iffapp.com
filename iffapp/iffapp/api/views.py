from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.http import Http404
from .permissions import IsOwnerOrReadOnly

# the right way to import from another app! (ignore Pycharm's griping)
from ifftasks.models import IffList, TodoItem
from iffapp.users.models import User

from .serializers import IffListSerializer, TodoItemSerializer, UserSerializer


class IffListCreateAPIView(ListCreateAPIView):
    # queryset = IffList.objects.all() # this returns all the things, which is bad
    permission_classes = (IsOwnerOrReadOnly, IsAuthenticated, )
    serializer_class = IffListSerializer
    lookup_field = 'id'  # change to uuid for security in production!

    def get_queryset(self):
        return IffList.objects.filter(user=self.request.user)


class IffListRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    permission_classes = (IsOwnerOrReadOnly, IsAuthenticated, )
    serializer_class = IffListSerializer
    lookup_field = 'id'  # change to uuid for security in production!

    def get_queryset(self):
        return IffList.objects.filter(user=self.request.user)


class TodoListCreateAPIView(ListCreateAPIView):
    queryset = TodoItem.objects.all()  # this returns all the things, which is bad
    permission_classes = (IsAuthenticated, )
    serializer_class = TodoItemSerializer
    lookup_field = 'id'  # change to uuid for security in production!

    def post(self, request, format=None):
        serializer = TodoItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # def get_queryset(self):   # figure this out to get only todoitems owned by authenticated user
    #     return TodoItem.objects.filter(user=self.request.user)


class TodoRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    queryset = TodoItem.objects.all()  # this returns all the things, which is bad
    permission_classes = (IsAuthenticated, )
    serializer_class = TodoItemSerializer
    lookup_field = 'id'  # change to uuid for security in production!

    # def get_queryset(self):
    #     return TodoItem.objects.filter(user=self.request.user)


class UserListCreateAPIView(ListCreateAPIView):
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly, )
    serializer_class = UserSerializer
    lookup_field = 'id'  # change to uuid for security in production!

    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)


class UserRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly, )
    serializer_class = UserSerializer
    lookup_field = 'id'  # change to uuid for security in production!

    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)
